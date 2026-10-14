# Khanu user guide

## Explore tutoring sessions

Open the Khanu home page. Browse six sample services, type a subject/tutor/goal into search, or choose a category. Each card shows the sample tutor, learner level, price, duration, and description. The catalog is demonstration content; it does not represent a live roster or guarantee appointment availability.

## Ask Khanu for a match

Describe a learning goal in the Study Buddy form. Subject, level, and budget can refine the results. Khanu ranks the catalog and explains why each result fits. The standard ranker is deterministic and runs in the app. An optional local language model can provide a rewritten explanation in the full-stack version. No model is required to use matching.

## Book and manage a sample session

In the full-stack version, register or sign in, choose a tutoring card, set a future date and time, and optionally add a note. Use **My sessions** to review or cancel upcoming appointments. The account and booking belong to the signed-in user.

In the GitHub Pages version, choose a display name to start a browser demo profile. No password or email address is collected. Create a sample appointment and manage it from **My sessions**. Browser demo records stay in that browser's local storage and are not shared with a tutor or synchronized to another device. Clearing the browser's site data removes them.

## Personalize Khanu

Use the moon/sun control for the color theme. The palette control on the live robot cycles its shell color. These preferences are kept in the current browser.

## Which version am I using?

The gold banner identifies browser-only Pages or temporary in-memory mode. In full-stack mode, real persistence requires MongoDB. The current sample app does not charge a fee, connect to a calendar, send messages to tutors, or conduct video sessions.
