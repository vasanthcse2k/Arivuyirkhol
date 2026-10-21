# Source comparison and implementation

Reference: https://arivuyirkhol.netlify.app/ — attempted on 10 October 2026. Web access failed and a separate HTTP request reported that the hostname could not be resolved. Therefore no claims can be made about features missing from that site, its appearance, or exact parity. This project is a new implementation based on the supplied PDF, not a verified copy of the reference site. When the reference becomes accessible, compare its navigation, branding and content with this inventory.

The PDF was read as reference content, not as instructions to execute. All 11 pages were text-extracted; pages 6 and 10 were rendered and visually inspected to recover their illustrated lists.

| PDF pages | Content | Application |
| --- | --- | --- |
| 1, 5 | Science communication; biotechnology, health and science | Hero and introduction |
| 2–4 | Technical language, unclear pitches, public understanding, why communication matters | Communication-gap section |
| 6 | Blog Articles, Research Summaries, Plagiarism Detection, LinkedIn Content, Video Script Writing, Presentations & Infographics, Educational Content | Seven service cards and form options |
| 7 | Accuracy, clarity, engagement, audience focus, professional writing, confidentiality | Quality promise and confidentiality request |
| 8 | Understand, Translate, Deliver, Refine | Four-stage approach |
| 9 | Scientist, Doctor, Investor, Business Leader, Student, Public | Interactive audience selector |
| 10 | Eight client sectors | Client-sector grid |
| 11 | Contact email and follow-up intent | Email link and database-backed enquiry form |

New implementation features: responsive React UI, audience selector, backend validation, consent field, confidentiality request flag, MongoDB persistence, rate limiting and health endpoint. These are implementation additions, not assertions about gaps in the unavailable website. No prices, testimonials, credentials, turnaround guarantees, email automation, or actual plagiarism scanning have been invented.

Brand treatment uses a typographic mark and original CSS science illustration; it does not reproduce the PDF logo exactly. The service descriptions are editorial summaries based on the service names. Source wording was corrected for grammar where needed.

## Poster update — 11 October 2026
Added the supplied poster as an original image asset, its emblem in the header, Who We Are, four focus areas, Our Goal, brand tagline, and Website Copywriting as an eighth service. Expanded service descriptions and research article plagiarism wording. Backend validation accepts the new services and retains the previous plagiarism name for compatibility.
