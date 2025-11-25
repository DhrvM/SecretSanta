Here's what's left for the backend:

---

## Remaining Backend Tasks

### 1. **Matching Algorithm** (`backend/app/utils/matching.py`)
This is the core Secret Santa logic. It needs to:
- Take a list of participants.
- Shuffle them so that each person is assigned to gift someone else (no one gifts themselves).
- Update the `giftee_id` column in the `participants` table for each person.

*This is a classic "derangement" problem in combinatorics.*

---

### 2. **Email Service** (`backend/app/utils/email.py`)
This handles sending the match notification emails. It needs to:
- Connect to an SMTP server (Gmail, SendGrid, Resend, etc.).
- Send an email to each participant with:
  - The name of the person they need to buy a gift for.
  - The party details (date, time, budget, description).
- Support "resend" functionality for individual participants or all participants.

---

### 3. **Wire Up Matching + Email in the Lock Endpoint**
Currently, `POST /api/party/{party_id}/lock` has `TODO` comments. Once the above two are done, we need to:
- Call the matching algorithm.
- Save the matches to the database.
- Send emails to everyone.

---

### 4. **(Optional) Input Validation & Error Handling**
- Validate that the `id` (party code) is exactly 6 alphanumeric characters.
- Add rate limiting to prevent spam (e.g., someone joining a party 1000 times).
- Better error messages for edge cases.

---

### 5. **(Optional) Tests**
- Unit tests for the matching algorithm (ensure no self-assignments, ensure everyone is assigned).
- Integration tests for the API endpoints.

---

**Which one would you like to tackle first?** I'd recommend starting with the **Matching Algorithm** since it's the heart of the app, and then moving to **Email**.