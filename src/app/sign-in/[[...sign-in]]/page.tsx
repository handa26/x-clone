import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
	return (
		<div className="flex h-screen items-center bg-black p-8 text-white">
      {/* Left Column: Logo */}
			<div className="hidden w-1/2 items-center justify-center lg:flex">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="320"
					height="320"
					viewBox="0 0 24 24"
				>
					<path
						fill="white"
						d="M 26.609375 29.023438 L 3.425781 29.023438 L 3.425781 26.707031 L 24.3125 26.707031 L 24.3125 23.242188 L 3.390625 23.242188 L 3.441406 0.015625 L 11.46875 0.015625 L 11.46875 17.117188 L 9.167969 17.117188 L 9.167969 2.335938 L 5.738281 2.335938 L 5.695312 20.925781 L 26.609375 20.925781 L 26.609375 29.023438"
					/>
				</svg>
			</div>

			<div className="flex w-full flex-col gap-6 lg:w-1/2 max-w-[440px] mx-auto lg:mx-0">
				<div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-white">
            Happening now
          </h1>
          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">Join today.</h2>
        </div>

				{/* Right Column: Title + Customized Auth Flow */}
				<SignIn
          oauthFlow="popup"
          appearance={{
            // 1. Strip out the default card background, borders, and shadows
            options: {
              elevation: "flush",
              socialButtonsPlacement: "top",
              socialButtonsVariant: "blockButton",
            },
            // 2. Global color and structural variable overrides
            variables: {
              colorBackground: "transparent",
              colorMutedForeground: "#71767b",
              colorInput: "#000000",
              colorInputForeground: "#ffffff",
              colorBorder: "#2f3336",
              colorPrimary: "#ffffff",
              borderRadius: "9999px",
            },
            // 3. Granular Tailwind class injection to match X's interface elements
            elements: {
              headerTitle: 'hidden',
              rootBox: "w-full",
              cardBox: "w-full p-0",
              card: "w-full p-0 bg-transparent",
              socialButtonsBlockButton: 
                "bg-white text-black hover:bg-neutral-200 border-none transition h-10 font-bold text-sm rounded-full",
              socialButtonsBlockButtonText: "text-black font-bold",
              dividerRow: "my-4",
              dividerLine: "bg-[#2f3336]",
              dividerText: "text-[#71767b] font-normal text-sm px-2",
              formFieldLabel: "text-white text-sm",
          // Customize the wrapper layout around the label
              formFieldInput: 
                "bg-white border border-[#2f3336] focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] text-black rounded-full h-12 px-3 transition-all",
              formButtonPrimary: 
                "bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white border-none transition h-10 font-bold text-sm rounded-full mt-2",
              footer: "mt-4",
              footerActionText: "text-[#71767b]",
              footerActionLink: "text-[#1d9bf0] hover:underline font-normal",
            },
          }}
        />
			</div>
		</div>
	);
};

export default SignInPage;
