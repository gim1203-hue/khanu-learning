from pathlib import Path
import argparse
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--root',type=Path,default=ROOT)
ROOT=parser.parse_args().root.resolve()
assets=ROOT/'docs'/'assets'
assets.mkdir(parents=True,exist_ok=True)

# Reproducible planning wireframe, not a screenshot of the live application.
im=Image.new('RGB',(1200,960),'white'); d=ImageDraw.Draw(im)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',25)
def box(xy,text):
    d.rectangle(xy,outline='#777777',width=2)
    d.multiline_text((xy[0]+18,xy[1]+15),text,font=font,fill='black',spacing=8)
box((20,20,1180,95),'KHANU                 Find a tutor     My sessions     Theme     Account')
box((20,120,745,285),'HERO\nLearning support and explore sessions')
box((770,120,1180,285),'Animated study buddy')
box((20,310,1180,455),'AI MATCH FORM\nLearning goal | Subject | Level | Budget | Find my best fit')
box((20,480,1180,590),'RECOMMENDATIONS\nGenerated explanation or explicit fallback | Ranked catalog cards')
box((20,615,1180,755),'CATALOG\nSearch | Category filters | Service details | Book a session')
box((20,780,580,935),'ACCOUNT AND BOOKING\nRegister / Login\nFuture date and time | Notes')
box((605,780,1180,935),'MY SESSIONS\nUpcoming bookings\nCancel own booking | Logout')
im.save(assets/'wireframe.png')

doc=Document(); sec=doc.sections[0]
sec.top_margin=sec.bottom_margin=Inches(.65)
sec.left_margin=sec.right_margin=Inches(.75)
sec.page_width=Inches(8.5);sec.page_height=Inches(11)
for name in ['Normal','Title','Heading 1','Heading 2']:
    doc.styles[name].font.name='Calibri'
    doc.styles[name].font.color.rgb=RGBColor(0,0,0)
doc.styles['Normal'].font.size=Pt(11)
doc.styles['Normal'].paragraph_format.space_after=Pt(7)
doc.styles['Title'].font.size=Pt(26)
doc.styles['Heading 1'].font.size=Pt(19)
doc.styles['Heading 2'].font.size=Pt(13)
sec.header.paragraphs[0].text='KHANU LEARNING | CAPSTONE DOCUMENTATION'
footer=sec.footer.paragraphs[0];footer.text='Khanu Learning | November 4 2026 | '
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
def para(text):doc.add_paragraph(text)
def heading(text):doc.add_heading(text,level=1)
def bullet(text):doc.add_paragraph(text,style='List Bullet')
def page(title):doc.add_page_break();heading(title)
def link(label,url):
    p=doc.add_paragraph();p.add_run(label+' ')
    rel=doc.part.relate_to(url,'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink',is_external=True)
    h=OxmlElement('w:hyperlink');h.set(qn('r:id'),rel)
    r=OxmlElement('w:r');t=OxmlElement('w:t');t.text=url;r.append(t);h.append(r);p._p.append(h)

doc.add_paragraph('Khanu Learning Capstone Documentation',style='Title')
para('A tutoring discovery and appointment booking application using React, Node.js, Express, MongoDB, and Google Gemini.')
heading('Overview and deployment status')
para('Khanu helps learners compare sample tutoring services, identify a suitable session, and manage appointments. The main full-stack application is publicly deployed on Render with MongoDB connected. A second frontend is published through GitHub Pages.')
para('Model-generated explanations have succeeded in live screenshots. Provider 503 errors and timeouts have also occurred, so AI availability remains intermittent. This document records the implementation, verified behavior, and remaining validation limits without claiming production readiness.')
link('Main application','https://khanu-learning.onrender.com/')
link('Pages frontend','https://gim1203-hue.github.io/khanu-learning/')
link('Repository','https://github.com/gim1203-hue/khanu-learning')
link('API health','https://khanu-learning.onrender.com/api/health')
heading('Problem and intended users')
para('Learners often know where they are struggling but cannot easily compare subject, level, price, or tutor fit. Khanu combines discovery, a recommendation explanation, and booking in one workflow. Intended users include school learners, test-prep students, language learners, college applicants, and parents helping plan support.')

page('Requirements and user stories')
for text in [
 'As a learner, I can register, log in, and log out so my bookings belong to my account.',
 'As a visitor, I can search and filter services and compare duration, category, tutor, level, description, and price.',
 'As a learner, I can describe my goal and optionally add subject, level, and budget to receive ranked choices and an AI explanation.',
 'As a signed-in learner, I can select a future date and time and add a note when creating a booking.',
 'As a learner, I can view and cancel my own appointments from My Sessions.',
 'As a learner, I cannot view or cancel another account\'s bookings.',
 'As a visitor, I can still browse recommendations when the model is unavailable, with an honest fallback label.'
]:bullet(text)
doc.add_heading('Functional requirements',level=2)
para('Account authentication, public catalog browsing, protected booking creation, appointment listing and cancellation, server validation, MongoDB storage, and an integrated AI explanation.')
doc.add_heading('Nonfunctional requirements',level=2)
para('Responsive presentation, separated frontend/backend/data layers, environment-based secrets, useful error handling, rate limiting, bounded AI requests, and clear data-processing disclosures.')
doc.add_heading('Scope boundaries',level=2)
para('Six sample services demonstrate the workflow. Payments, verified tutors, live scheduling availability, confirmations, calendar synchronization, and video lessons are outside scope. A booking is a prototype planning record rather than a confirmed real-world service.')

page('Architecture and MongoDB design')
doc.add_heading('Three tier architecture',level=2)
para('React and Vite render the interface. JSON REST requests reach Express routes, controllers, and services. Mongoose connects application operations to MongoDB. Recommendation logic ranks catalog records before requesting a Google Gemini explanation.')
para('React frontend -> Express API -> Mongoose -> MongoDB\nExpress recommendation service -> Google Gemini Interactions API')
doc.add_heading('User model',level=2)
para('Fields: name, unique normalized email, passwordHash, and timestamps. Passwords are hashed with bcrypt. Authentication uses an expiring signed JWT. One user owns many bookings.')
doc.add_heading('Service model',level=2)
para('Fields: unique slug, title, category, duration, price, level, format, tutor, rating, tags, and description. Services provide catalog facts for discovery and AI explanations.')
doc.add_heading('Booking model',level=2)
para('Fields: user ObjectId, serviceSlug, serviceTitle, tutor snapshot, startsAt, notes, status, and timestamps. Booking operations filter by the authenticated owner. The service title and tutor snapshot preserve meaningful display if catalog content changes.')
doc.add_heading('API and organization',level=2)
para('Public: GET /api/health, GET /api/services, POST /api/ai/recommend. Accounts: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me. Protected bookings: GET/POST /api/bookings and PATCH /api/bookings/:id/cancel.')
para('Source folders separate frontend components, context and service adapters from backend routes, controllers, services, middleware, configuration, and models. Detailed endpoint examples are in docs/API_REFERENCE.md.')

page('Page and component wireframe')
para('This planning wireframe shows discovery, recommendation, account, booking, and dashboard areas. At narrow widths, major columns stack and navigation collapses into a menu.')
doc.add_picture(str(assets/'wireframe.png'),width=Inches(6.9))
para('Main React components include App, Robot, ServiceCard, AuthModal, and BookingModal. AuthContext manages the account session; the API adapter selects the backend or explicitly labeled browser demo.')

page('AI feature and privacy')
para('The deployed configuration uses Google Gemini 3.5 Flash-Lite. A deterministic content scorer ranks up to three catalog entries using goal, subject, level, budget, and rating. The backend sends those options and learner preferences to the native Interactions API. The model explains the first choice in the discovery workflow.')
para('Missing budget and level are represented as unspecified. The prompt asks the model to use supplied facts, state actual mismatches, avoid invented availability or outcomes, and never claim to create a booking. These instructions reduce risk but do not guarantee correctness; the developer must evaluate responses.')
para('A generated response reports ai.status=generated and Khanu AI + smart matching. Failed or invalid output retains catalog cards and displays an explicit fallback notice. Google requests have a 45-second total bound with one retry for selected transient server errors. Other compatible providers use 20 seconds.')
doc.add_heading('Data boundary',level=2)
para('Google receives goal, subject, level, budget, and ranked catalog facts. Email, password, auth tokens, and booking notes are not included in the model payload. The API key remains server-only. Native requests use store=false, while provider retention and data-use policies still apply. Learners should avoid personal details in goals.')
doc.add_heading('Responsible use of AI',level=2)
para('AI assistance supported scaffolding, code review, documentation, test design, and deployment diagnosis. The developer remains responsible for understanding the source, checking generated claims, explaining data relationships, and making final decisions. Simulated provider tests do not prove live availability.')

page('Live AI evidence and validation')
para('The following user-provided screenshot demonstrates a generated recommendation explanation and correct treatment of unspecified budget and level on November 4, 2026. It is evidence of one successful response, not a reliability benchmark.')
evidence=assets/'ai-recommendation.png'
if evidence.exists():doc.add_picture(str(evidence),width=Inches(6.9))
para('Live API checks passed registration, login, duplicate-account rejection, invalid-credential/token rejection, filtering, future booking, cancellation, and cross-account isolation. Test bookings were canceled. MongoDB connectivity and database-backed requests are confirmed.')
para('The automated suite has 15 passing tests covering API flow, scoring, browser demo, model requests, invalid output, diagnostics, retry limits, and unspecified preferences. AI provider failures remain intermittent. A controlled restart-persistence check and broader browser/device/accessibility testing remain outstanding.')

page('Build deployment and remaining checks')
para('Open the Khanu-Learning-Complete repository folder in VS Code. Install Node.js 20 or newer. Run npm ci, copy .env.example to the ignored .env, and set a strong JWT_SECRET plus reachable MONGODB_URI. Run npm run dev for Vite at http://127.0.0.1:5173 and the API on port 5000.')
para('Verification commands: npm test; npm run build; npm run build:pages. For production-like local use, run npm run build then npm start at http://127.0.0.1:4173. VS Code Tasks provides development, test, and build shortcuts.')
para('Render builds with npm ci && npm run build and starts with npm start. Private environment values are JWT_SECRET, MONGODB_URI, and AI_API_KEY. Public values include NODE_ENV=production, CLIENT_URL=https://gim1203-hue.github.io, AI_MODEL=gemini-3.5-flash-lite, and AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai. The backend recognizes Google and uses native Interactions.')
para('GitHub Actions publishes Pages with the repository base path and the public Render API origin. A build without an API origin uses a browser-only demo; no backend credentials belong in VITE_* variables. The primary submission link is the Render application.')
doc.add_heading('Submission and remaining validation',level=2)
for text in [
 'Submit the repository link, main Render URL, and this document. The repository exceeds the required 15 commits; assess history quality separately.',
 'Preserve successful UI/AI evidence and state the intermittent availability limitation.',
 'Verify controlled MongoDB persistence across a restart and the complete browser account-to-booking flow.',
 'Check more mobile widths, keyboard/accessibility behavior, and invalid-input cases before final assessment.'
]:bullet(text)
doc.core_properties.title='Khanu Learning Capstone Documentation'
doc.core_properties.author='Khanu Learning project team'
doc.core_properties.subject='Requirements architecture AI deployment and verified status'
out=ROOT/'Khanu Learning Capstone Documentation.docx';doc.save(out);print(out)
