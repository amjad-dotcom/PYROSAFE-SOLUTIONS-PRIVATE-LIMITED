# Security Specification - AgencyFlow CRM

## 1. Data Invariants
- A Lead must belong to a Client and an Owner (authenticated user).
- An Invoice/Quote must have line items and correctly calculated totals.
- Clients and Vendors are shared across the organization but only editable by authenticated users.
- Invoices cannot be modified once they are in 'Paid' or 'Cancelled' status.
- Owners can only access their own tasks (or as an admin).

## 2. Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create a client with a fake `ownerId`.
2. **State Shortcutting**: Update an invoice status from 'Draft' directly to 'Paid' without proper fields.
3. **Ghost Fields**: Adding `isVerified: true` to a client document.
4. **ID Poisoning**: Injected junk strings in `clientId`.
5. **PII Leak**: Non-authenticated read of `clients` collection.
6. **Cross-Tenant Write**: User A trying to update User B's tasks.
7. **Negative Amounts**: Creating an invoice item with `rate: -500`.
8. **Invalid GST**: Setting `cgst` + `sgst` on an interstate transaction (should be `igst`).
9. **Terminal State Edit**: Trying to change the `total` of a 'Paid' invoice.
10. **Resource Exhaustion**: Sending a 1MB string in `client.name`.
11. **Malicious Enum**: Setting `lead.status` to `InjectedStatus`.
12. **Future Dates**: Creating a `createdAt` timestamp in the future.

## 3. Test Runner (Draft Rules Logic)
The rules will enforce:
- `auth != null` for all operations.
- `isValidId(id)` on all document paths.
- `isValidClient`, `isValidInvoice`, etc. helpers.
- `affectedKeys().hasOnly(...)` for tiered updates.
- Server-side timestamp validation.
