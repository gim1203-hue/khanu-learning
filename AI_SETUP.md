# Hosted AI setup and acceptance checks

## What the feature does

Khanu ranks the tutoring catalog by learner goal, subject, level, and budget. The backend then sends those preferences and the top three catalog choices to a configured language model. The model writes a short explanation of why the first choice fits. It does not create bookings or choose services outside the catalog. Catalog ranking remains deterministic; the explanation is model-generated.

## Render configuration

This code must first be committed and deployed from the repository connected to Render. In the Render web service Environment settings, add these server-only variables:

- AI_BASE_URL: the provider's compatible API base URL, including its version path (typically /v1). Do not append /chat/completions.
- AI_MODEL: an exact model identifier enabled for your provider account.
- AI_API_KEY: an API key issued by that provider. Enter it directly in Render; never put it in chat, Git, screenshots, or VITE_* variables.

The hosted integration sends POST /chat/completions with bearer authentication and max_completion_tokens. Confirm your selected provider/model supports that request format. Provider-specific adaptation may be needed. A chat subscription alone does not establish API access or available credit.

Save the settings and redeploy. LOCAL_AI_URL is for a model reachable from the backend machine; a localhost address on Render cannot reach a model on your laptop.

## Verification required before claiming completion

1. Open the deployed app and request help with algebra, chemistry, and Spanish.
2. Check that the response includes ai.status = generated and poweredBy = Khanu AI + smart matching. A healthy backend or configured variables alone do not prove AI worked.
3. Confirm the explanation refers to the first catalog choice and reflects the learner's goal, price, and level. Try goals phrased without the service title as well.
4. Confirm the model does not claim to book or invent availability. Model output still needs evaluation; prompting cannot guarantee factual accuracy.
5. Test provider failure using a development configuration, not by disrupting production. Results should be labeled fallback and continue to show catalog matches.
6. Keep a screenshot and sample input/output as submission evidence. Do not capture keys or personal student details.

## Privacy and limitations

In hosted mode, learner goals, subject, level, budget, and ranked catalog information are sent from Express to the configured AI provider. User email, password, booking notes, and authentication tokens are not included in the model payload. The UI asks learners to avoid personal information. Provider data practices depend on the chosen service and account settings.

The key stays in backend environment variables. Requests time out, redirects are rejected, and the recommendation route permits 10 requests per minute per client IP. This rate limit is not an account-wide spending cap; use provider-side usage limits too.

## Submission explanation

"Khanu combines catalog scoring with an AI-generated recommendation explanation. The server provides real catalog choices and the learner preferences to a language model, which explains the top recommendation within the discovery workflow. If the provider is unavailable, a visibly labeled deterministic fallback keeps browsing and booking usable."

Only describe the deployed feature as model-powered after the live acceptance checks pass. Local automated provider tests use simulated responses; they do not prove a real API key or hosted model is working.
