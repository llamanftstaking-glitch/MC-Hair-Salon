#!/usr/bin/env python3
"""
Parse DaySmart appointment book PDF → appointments.json
Usage: python3 parse-appointments.py <pdf_path>
"""
import sys, re, json
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Run: /tmp/pdfenv/bin/python3 parse-appointments.py ...")
    sys.exit(1)

PDF_PATH = sys.argv[1] if len(sys.argv) > 1 else "/Users/rayquinones/Downloads/reso 2026 FULL.pdf"

# Regex patterns
RE_TIME_RANGE = re.compile(r'^(\d{1,2}:\d{2}\s+[AP]M)\s+-\s+(\d{1,2}:\d{2}\s+[AP]M)\s+(\d+)\s+(.+)$')
RE_DATE       = re.compile(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(\w+ \d{1,2}, \d{4})')
RE_PRICE      = re.compile(r'\$(\d+\.?\d*)$')
RE_PHONE      = re.compile(r'(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})\s*')
MONTHS = {"January":1,"February":2,"March":3,"April":4,"May":5,"June":6,
          "July":7,"August":8,"September":9,"October":10,"November":11,"December":12}

def parse_date(day_str):
    # "January 15, 2026" -> "2026-01-15"
    m = re.match(r'(\w+)\s+(\d{1,2}),\s+(\d{4})', day_str)
    if not m: return None
    month, day, year = m.group(1), int(m.group(2)), int(m.group(3))
    mo = MONTHS.get(month)
    if not mo: return None
    return f"{year}-{mo:02d}-{day:02d}"

def parse_appt_line(rest):
    """Parse: client [email] [phone] service $price  -> dict or None"""
    # Skip time blocks
    if rest.startswith("Time Block:"):
        return None

    # Extract price from end
    price_m = RE_PRICE.search(rest)
    if not price_m:
        return None
    price = float(price_m.group(1))
    rest = rest[:price_m.start()].strip()

    # Try to extract phone
    phone = ""
    phone_m = RE_PHONE.search(rest)
    if phone_m:
        phone = phone_m.group(1).strip()
        # Split on phone: before = client name, after = service
        before = rest[:phone_m.start()].strip()
        after  = rest[phone_m.end():].strip()
    else:
        # No phone: need to split client name from service
        # Heuristic: service is usually last 1-4 words / known service keywords
        before = rest
        after  = ""

    # If no phone, try to identify service by splitting on known service keywords
    if not phone_m:
        # Try splitting at service keywords
        service_keywords = [
            "Blowdry", "Haircut", "Color", "Highlights", "Balayage",
            "Keratin", "Brazilian", "Treatment", "Single Process", "Double Process",
            "Gloss", "Toner", "Ombre", "makeup", "Makeup", "Trim", "Bang",
            "Root", "Full", "Partial", "Weave", "Extensions", "Relaxer",
            "Relaxer Touch", "Perm", "Wash", "Style", "Updo", "Braid",
            "Express", "Walk In", "Woman", "Man", "Kid"
        ]
        found_svc = None
        found_pos = len(rest)
        for kw in service_keywords:
            idx = rest.find(kw)
            if idx > 0 and idx < found_pos:
                found_pos = idx
                found_svc = kw
        if found_svc:
            before = rest[:found_pos].strip()
            after  = rest[found_pos:].strip()
        else:
            # Give up: use whole thing as service, no client name split possible
            before = ""
            after  = rest

    client = before.strip()
    service = after.strip()

    # Clean up client name: remove trailing email-like or junk
    # If client is empty default to "Walk In"
    if not client or client == "Walk In":
        client = "Walk In"

    if not service:
        return None

    return {"client": client, "phone": phone, "service": service, "price": price}

appointments = []
seen_tickets = set()  # dedup by ticket number

current_stylist = None
current_date = None
schedule_for_next = False

print(f"Parsing {PDF_PATH}...", file=sys.stderr)

with pdfplumber.open(PDF_PATH) as pdf:
    total = len(pdf.pages)
    for page_num, page in enumerate(pdf.pages):
        if page_num % 100 == 0:
            print(f"  Page {page_num}/{total}...", file=sys.stderr)

        text = page.extract_text() or ""
        lines = text.split("\n")

        for line in lines:
            line = line.strip()

            # Detect "Schedule for" header
            if line == "Schedule for":
                schedule_for_next = True
                continue
            if schedule_for_next:
                current_stylist = line
                schedule_for_next = False
                continue

            # Detect date line
            date_m = RE_DATE.match(line)
            if date_m:
                current_date = parse_date(date_m.group(2))
                continue

            # Skip header row
            if line.startswith("Time Ticket Client"):
                continue

            # Skip printed-on footer
            if line.startswith("Printed on:"):
                continue

            # Skip formula history
            if "Formula History" in line or "No formula history" in line:
                continue

            # Try to match appointment row
            appt_m = RE_TIME_RANGE.match(line)
            if not appt_m:
                continue

            time_start = appt_m.group(1)
            time_end   = appt_m.group(2)
            ticket     = appt_m.group(3)
            rest       = appt_m.group(4).strip()

            # Skip if no stylist/date context yet
            if not current_stylist or not current_date:
                continue

            # Dedup by ticket (same appointment appears per stylist)
            if ticket in seen_tickets:
                continue

            parsed = parse_appt_line(rest)
            if not parsed:
                continue

            seen_tickets.add(ticket)
            appointments.append({
                "ticket":    ticket,
                "date":      current_date,
                "timeStart": time_start,
                "timeEnd":   time_end,
                "stylist":   current_stylist,
                "client":    parsed["client"],
                "phone":     parsed["phone"],
                "service":   parsed["service"],
                "price":     parsed["price"],
            })

print(f"\nFound {len(appointments)} appointments", file=sys.stderr)

out_path = Path(PDF_PATH).parent / "appointments.json"
with open(out_path, "w") as f:
    json.dump(appointments, f, indent=2)

print(f"Saved to {out_path}", file=sys.stderr)

# Print sample
print("\nSample (first 5):", file=sys.stderr)
for a in appointments[:5]:
    print(f"  {a['date']} {a['timeStart']} | {a['stylist']} | {a['client']} | {a['service']} ${a['price']}", file=sys.stderr)
