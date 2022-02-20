# Basic Auth Playground

> Disclaimer: Any code in this repository is not made with any kind of production-readyness in mind.
> I am just looking into how Basic authentication works and how to apply it in
> practice with partially proper considerations of storing passwords for comparison,
> using cookie sessions to avoid the 1s comparison per user request and other interesting
> concepts.
>
> This turned into a basic auth and password hashing playground! I have learnt about `bcrypt` and
> `argon2`.

## Learnings

- `Digest` authentication scheme is not safer than the `Basic` authentication scheme when using TLS; if anything, `Digest` makes authentication less secure over TLS than `Basic`<sup>[[1]](#bitbucket-on-digest)</sup>.
- Realm is for asking the browser for credentials per authentication system or region. Say, if you want to have an admin section use a different set of credentials while the user is logged in via `Basic` in a non-admin section, you can have two different realms: one for non-admin and one for admin; then the browser will prompt for login in the admin section, if you haven't attempted to login there before.
  - That ^ is a bit of a contrived example; perhaps a better example could be a multi-tenant app that uses `Basic` authentication: each tenant in the application would be it's own "realm"- so if a user has access to multiple tenants, they would be forced to login to each- separately.
- `WWW-Authenticate`<sup>[[2]](#mdn-on-www-authenticate)</sup> is the "challenge" header; if the browser sees it and also a `401 (Unauthorized)` status code on a response from the server, the browser assumes it must send credentials.
  - This is also where you determine whether to use `Basic`, `Digest` or other authentication schemes and set their options (realm, for instance).
  - _Only_ `MD5` is valid as a "encryption" algorithm for `Digest` authentication scheme in almost all browsers. Only Firefox supports `SHA2-256` and `SHA2-512` (which doesn't help much, anyway)<sup>[[3]](#mdn-on-www-authenticate-browser-compatibility)</sup>.
- There are some interesting authentication schemes for Windows users (but it seems like the user must be sitting on a domain joined PC to benefit), such as `Negotiate` (Kerberos, with fallback to NTLM) and `NTLM`<sup>[[4]](#msft-docs-on-authentication-schemes)</sup>.
- When you need to store passwords (or rather, hashes of passwords- for use in comparison on user login), the current (2022-02-22) best practice is to use `Argon2i`.
  - Argon2 spec (has recommended secure parameters in the bottom): https://www.password-hashing.net/argon2-specs.pdf
  - Before `Argon`, I would've said `bcrypt`: with enough salt rounds (cost factor) that it takes approximately `1 second` to hash a password on production hardware (i.e. also the comparison takes that long).
    - `bcrypt` has some minor problems<sup>[[5]](#wikipedia-bcrypt-criticisms)</sup>, but is generally better than [other alternatives out there](https://security.stackexchange.com/a/133251) and incorporates a great safe-by-default mechanism: adding salt to passwords.
- Pepper; when salt is not enough. Using a pepper is the equivalent to salt, but adds an extra layer. Pepper can be a global secret for the entire application or can be generated per-user and stored away from the database (if you store it in the DB, it's equivalent to the salt and adds no additional protection).
  - Pepper is meant to protect your users' passwords in the event that a database with hashed passwords and salts gets dumped/stolen: even if crackers attempt to brute force the hashes with the salts in the DB, they won't know the pepper and will have a _much_ harder time cracking a user's password.

## Footnotes

1. <a name="bitbucket-on-digest"></a> Bitbucket on deprecating `Digest` authentication scheme: https://bitbucket.org/blog/fare-thee-well-digest-access-authentication
2. <a name="mdn-on-www-authenticate"></a> MDN on the `WWW-Authenticate` header: https://developer.mozilla.org/docs/Web/HTTP/Headers/WWW-Authenticate
3. <a name="mdn-on-www-authenticate-browser-compatibility"></a> MDN on browser compatibility for the `WWW-Authenticate` header: https://developer.mozilla.org/docs/Web/HTTP/Headers/WWW-Authenticate#browser_compatibility
4. <a name="msft-docs-on-authentication-schemes"></a> MSFT Docs on available HTTP Authentication Schemes: https://docs.microsoft.com/dotnet/framework/wcf/feature-details/understanding-http-authentication#http-authentication-schemes
5. <a name="wikipedia-bcrypt-criticisms"></a> Wikipedia bcrypt criticims: https://en.wikipedia.org/wiki/Bcrypt#Criticisms
