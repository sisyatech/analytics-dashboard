import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, GraduationCap, Loader2, Shield, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DomeGallery from "@/components/shared/DomeGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_NAME, ROUTES } from "@/constants";
import { useAdminLogin, useSubadminLogin } from "@/hooks/auth/useAuthMutations";
import { cn } from "@/lib/utils";
import { type LoginSchema, loginSchema } from "@/schemas/auth";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/auth";

export default function Login() {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuthStore();

	const [role, setRole] = useState<UserRole>("admin");
	const [showPassword, setShowPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	// Form Hook
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			userId: "",
			password: "",
		},
	});

	// Use custom hooks
	const adminLogin = useAdminLogin();
	const subadminLogin = useSubadminLogin();

	const mutation = role === "admin" ? adminLogin : subadminLogin;
	const isLoading = mutation.isPending;
	const error = mutation.error;

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated && user) {
			const currentRole = useAuthStore.getState().role;
			if (currentRole === "admin") {
				navigate(ROUTES.ADMIN_DASHBOARD);
			} else if (currentRole === "subadmin") {
				navigate(ROUTES.SUBADMIN_DASHBOARD);
			}
		}
	}, [isAuthenticated, user, navigate]);

	const onSubmit = (data: LoginSchema) => {
		mutation.mutate({ userId: data.userId, password: data.password });
	};

	const displayError = error instanceof Error ? error.message : null;

	// Helper to sync controlled input props with RHF
	const handleFocus = (field: string) => setFocusedField(field);
	const handleBlur = () => setFocusedField(null);

	return (
		<div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50">
			{/* Left Side - Branding with DomeGallery */}
			<div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1e3a5f] via-[#2563eb] to-[#2c5282] relative overflow-hidden">
				<div className="absolute inset-0 z-10 h-full w-full">
					<DomeGallery
						fit={1}
						minRadius={500}
						maxRadius={1000}
						overlayBlurColor="rgba(30, 58, 95, 0.8)"
						grayscale={false}
						imageBorderRadius="12px"
						openedImageBorderRadius="20px"
					/>
				</div>
			</div>

			{/* Mobile Header - Branding */}
			<div className="lg:hidden bg-linear-to-br from-[#1e3a5f] to-[#2c5282] px-6 py-4 text-white shadow-lg">
				<div className="flex items-center gap-2">
					<div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
						<GraduationCap className="w-5 h-5" />
					</div>
					<h1 className="text-xl font-bold">{APP_NAME}</h1>
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="w-full max-w-xl px-2 sm:px-6"
				>
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
								Welcome back!
							</h2>
							<p className="text-gray-600 text-sm sm:text-base">
								Please log in to your dashboard to continue.
							</p>
						</div>

						{/* Role Selection */}
						<div className="space-y-3">
							<div className="text-sm font-medium text-gray-700">I am logging in as:</div>
							<div className="relative flex gap-2 bg-gray-100 p-1 rounded-xl">
								<motion.div
									layout
									className={cn(
										"absolute top-1 bottom-1 rounded-lg bg-white shadow-md transition-all duration-300 ease-out",
										role === "admin"
											? "left-1 w-[calc(50%-0.25rem)]"
											: "left-[calc(50%+0.25rem)] w-[calc(50%-0.25rem)]",
									)}
									transition={{ type: "spring", stiffness: 350, damping: 30 }}
								/>

								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.98 }}
									type="button"
									onClick={() => setRole("admin")}
									className={cn(
										"relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 z-10",
										role === "admin"
											? "text-primary font-semibold"
											: "text-gray-600 hover:text-gray-900",
									)}
								>
									<Shield
										className={cn(
											"w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
											role === "admin" && "scale-110",
										)}
									/>
									Admin
								</motion.button>

								<motion.button
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.98 }}
									type="button"
									onClick={() => setRole("subadmin")}
									className={cn(
										"relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 z-10",
										role === "subadmin"
											? "text-primary font-semibold"
											: "text-gray-600 hover:text-gray-900",
									)}
								>
									<User
										className={cn(
											"w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
											role === "subadmin" && "scale-110",
										)}
									/>
									Subadmin
								</motion.button>
							</div>
						</div>

						{/* Login Form */}
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* User ID */}
							<motion.div
								className="space-y-2"
								animate={{
									scale: focusedField === "userId" ? 1.01 : 1,
									opacity: focusedField === "userId" ? 1 : 0.98,
								}}
								transition={{ duration: 0.2 }}
							>
								<label htmlFor="userId" className="block text-sm font-medium text-gray-700">
									{role === "admin" ? "User ID" : "Email"}
								</label>
								<div className="relative group">
									<Input
										id="userId"
										type={role === "admin" ? "text" : "email"}
										placeholder={role === "admin" ? "Enter ID" : "Enter Email"}
										className={cn(
											"pl-4 pr-10 sm:pr-12 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300",
											"border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
											errors.userId &&
												"border-destructive focus:border-destructive focus:ring-destructive/20",
											focusedField === "userId" && "shadow-lg shadow-primary/10",
										)}
										disabled={isLoading}
										{...register("userId", {
											onBlur: handleBlur,
										})}
										onFocus={() => handleFocus("userId")}
									/>
									<div
										className={cn(
											"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-300",
											focusedField === "userId" && "text-primary scale-110",
										)}
									>
										<User className="w-5 h-5" />
									</div>
								</div>
								{errors.userId && (
									<p className="text-xs text-destructive mt-1">{errors.userId.message}</p>
								)}
							</motion.div>

							{/* Password */}
							<motion.div
								className="space-y-2"
								animate={{
									scale: focusedField === "password" ? 1.01 : 1,
									opacity: focusedField === "password" ? 1 : 0.98,
								}}
								transition={{ duration: 0.2 }}
							>
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<div className="relative group">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter Password"
										className={cn(
											"pl-4 pr-12 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300",
											"border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
											errors.password &&
												"border-destructive focus:border-destructive focus:ring-destructive/20",
											focusedField === "password" && "shadow-lg shadow-primary/10",
										)}
										disabled={isLoading}
										{...register("password", {
											onBlur: handleBlur,
										})}
										onFocus={() => handleFocus("password")}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className={cn(
											"absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-all duration-300 rounded p-1 hover:bg-gray-100",
											focusedField === "password" && "text-primary",
										)}
										disabled={isLoading}
									>
										{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
									</button>
								</div>
								{errors.password && (
									<p className="text-xs text-destructive mt-1">{errors.password.message}</p>
								)}
							</motion.div>

							{/* Error Message */}
							<AnimatePresence>
								{displayError && (
									<motion.div
										key="login-error"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className={cn(
											"bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg",
											"flex items-center gap-2",
										)}
									>
										<motion.div
											className="w-1.5 h-1.5 rounded-full bg-destructive"
											animate={{ scale: [1, 1.5, 1] }}
											transition={{ repeat: Infinity, duration: 1.2 }}
										/>
										{displayError}
									</motion.div>
								)}
							</AnimatePresence>

							{/* Submit Button */}
							<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
								<Button
									type="submit"
									className={cn(
										"w-full h-12 text-base font-semibold mt-6 relative overflow-hidden group hover:cursor-pointer",
										"shadow-md hover:shadow-lg transition-all duration-300",
										"bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
										"transform hover:scale-[1.01] active:scale-[0.98]",
									)}
									disabled={isLoading}
								>
									{isLoading ? (
										<span className="flex items-center justify-center gap-2">
											<Loader2 className="w-5 h-5 animate-spin" />
											Logging in...
										</span>
									) : (
										<>
											<span className="relative z-10 flex items-center justify-center gap-2">
												Log In
												<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
											</span>
											{/* Ripple effect on hover */}
											<span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left" />
										</>
									)}
								</Button>
							</motion.div>
						</form>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
