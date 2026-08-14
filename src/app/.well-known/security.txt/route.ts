const securityTxt = `Contact: https://bluedot.it.com/contact
Contact: http://w4rnwsxctthctfroeltj7d75wi7npdnllj5owy5okjwgj5jpjmlli7qd.onion/submit
Encryption: https://bluedot.it.com/.well-known/bluedot-disclosure-public-key.asc
Expires: 2027-08-14T00:00:00Z
Preferred-Languages: en
Canonical: https://bluedot.it.com/.well-known/security.txt
Policy: https://bluedot.it.com/security
# OpenPGP fingerprint: CBE5 3C6C 0D9E B273 45B8 5EC7 C6DC 2E04 2DE4 D1AD
`

export function GET() {
  return new Response(securityTxt, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
