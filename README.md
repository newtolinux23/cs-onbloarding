# C & S Delivery – New Hire Paperwork

- `index.html` – form new hires fill out (Direct Deposit, W-4, I-9 Section 1)
- `hr.html` – HR login to review submissions and download filled PDFs
- `packet-template.pdf` – fillable PDF template used for downloads

Submissions are stored in Supabase (table `hr_enrollments`); only HR admins can read them.
