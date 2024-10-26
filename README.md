# InspireGem v1.0.0

InspireGem is an AI-powered web application designed to generate personalized content using the power of Google Gemini. With InspireGem, users can easily access AI-driven suggestions, manage their requests through a tiered plan system, and enjoy a seamless and secure user experience.

## 🚀 Features

### User Authentication
- Sign in and sign up using Google Firebase.
- Secure authentication using Google credentials.

### Subscription Plans
- **Free Plan**: 50 requests per month.
- **Pro Plan**: 500 requests per month.
- **Enterprise Plan**: Unlimited requests.
- Real-time request tracking in Firestore.

### AI Content Generation
- Generate personalized content using AI powered by Google Gemini.
- Real-time content generation and suggestions for users.

### Payment Integration
- Stripe-powered payment flow for Pro and Enterprise plan upgrades.
- Seamless checkout experience for enhanced functionality.

### Responsive Design
- Built with Tailwind CSS for a fully responsive user interface.
- Light and dark mode options for a personalized experience.

## 🛠️ Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inspiregem.git
   cd inspiregem
   ```
2. Install dependencies:
```bash
npm install
```
3. Create a ```.env.local``` file in the root directory and add your Firebase and Stripe environment variables:
```.env.local
#Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_service_account_key

#Google Oauth Secrets
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

#GitHub Oauth Secrets
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

#You can get your Nextauth Secret at: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=your_nextauth_secret

#Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

#Google Gemini API Key
GEMINI_API_KEY=your_gemni_api_key

#API URL for interacting with /api/generate
NEXT_PUBLIC_API_URL=https://inspiregem.vercel.app
```
4. Run the development server:
```bash
npm run dev
```
5. Open your browser and go to:
```
http://localhost:3000
```

## 🧑‍💻 Usage

1. **Sign Up**: Users can sign up using their Google accounts.


2. **View Plans**: After signing up, users can view available plans (Free, Pro, and Enterprise).


3. **Upgrade Plan**: Use Stripe to upgrade to Pro or Enterprise.


4. **Content Generation**: Start generating AI-powered content once signed in.

## 📦 Deployment

To deploy InspireGem, ensure your Firebase, Google, and Stripe credentials are correctly set up in the .env file.

### Vercel

To deploy to Vercel:

1. Push your code to GitHub.


2. Connect your repository to Vercel and set up environment variables.


3. Deploy directly via the Vercel dashboard.



### Firebase Hosting

1. Initialize Firebase Hosting:
```bash
firebase init hosting
```

2. Deploy the app:
```bash
firebase deploy
```


## 🤝 Contributing

We welcome contributions! Please follow the steps below:

1. Fork the repository.


2. Create a feature branch (```git checkout -b feature-branch```).


3. Commit your changes (```git commit -m 'Add a new feature'```).


4. Push to the branch (```git push origin feature-branch```).


5. Open a Pull Request.



## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 💡 Future Plans

Enhanced AI-powered content generation.

Improved user analytics dashboard.

Additional authentication providers.



---

**InspireGem** - Unlock the power of AI-driven content creation!
