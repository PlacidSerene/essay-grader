# Chirp - Automated IELTS Essay Grading SAAS

Chirp is a Software as a Service (SAAS) application designed to streamline the process of grading IELTS essays. By leveraging advanced technologies such as Next.js, Prisma, TRPC, AWS Lambda, and S3, Chirp aims to provide educators and language learners with an efficient and accurate solution for evaluating written English proficiency.

![Chirp Dashboard](/public/thumbnail.png)

## Features

- **Automated Grading**: Utilizes sophisticated algorithms to analyze IELTS essays and provide detailed feedback on grammar, vocabulary, coherence, and more.
- **User Management**: Allows educators and learners to create accounts, manage profiles, and access grading services securely.
- **Essay Submission**: Enables users to submit essays directly through the platform, simplifying the grading process.
- **Scalable Architecture**: Built on modern technologies like Next.js and Prisma, ensuring scalability and performance as user demand grows.
- **Serverless Computing**: Leverages AWS Lambda for serverless execution of backend logic, minimizing operational overhead and maximizing efficiency.
- **Data Storage**: Utilizes AWS S3 for secure and reliable storage of essay submissions and grading results.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and static web applications.
- **Clerk**: A simple solution for user authentication.
- **Prisma**: A modern database toolkit for TypeScript and Node.js, providing type-safe database access and migrations.
- **TRPC (Transportable Remote Procedure Calls)**: A modern TypeScript-based RPC framework for building efficient and type-safe APIs.
- **AWS Lambda**: A serverless computing service that runs code in response to events, providing scalable and cost-effective backend execution.
- **AWS S3 (Simple Storage Service)**: A scalable object storage service designed to store and retrieve any amount of data from anywhere on the web.
- **Supabase**: Our postgres database for this this project, including a generous free tier.

## Getting Started

To run Chirp locally, follow these steps:

1.  Clone the repository:

    ```sh
    git clone https://github.com/PlacidSerene/essay-grader

    ```

2.  Install dependencies:

    ```sh
    cd essay-grader
    npm install

    ```

3.  Create an environment file (.env)

    ```sh
    GEMINI_API_KEY=
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    DATABASE_URL=
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=
    AWS_BUCKET_NAME=

    ```

4.  Setup the Lambda function, I have hosted the lambda in another repo. Please refer to:

    ```sh

    ```

5.  Open your browser and navigate to `http://localhost:3000` to access Chirp locally.
