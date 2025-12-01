"use client";
import useUser from "@/app/hook/useUser";
import { urlB64ToUint8Array } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { createNotification, deleteNotification as removeNotificationAction } from "@/actions/notification-db";

export default function NotificationRequest() {
	const { data: user, isFetching } = useUser();
	const queryClient = useQueryClient();

	const [notificationPermission, setNotificationPermission] = useState<
		"granted" | "denied" | "default"
	>("granted");

	// Check permission status when component mounts

	const showNotification = () => {
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				setNotificationPermission(permission);
				if (permission === "granted") {
					subscribeUser();
				} else {
					toast.info(
						"please go to setting and enable noitificatoin."
					);
				}
			});
		} else {
			toast.info("This browser does not support notifications.");
		}
	};

	async function subscribeUser() {
		if ("serviceWorker" in navigator) {
			try {
				// Check if service worker is already registered
				const registration =
					await navigator.serviceWorker.getRegistration();
				if (registration) {
					generateSubscribeEndPoint(registration);
				} else {
					// Register the service worker
					const newRegistration =
						await navigator.serviceWorker.register("/sw.js");
					// Subscribe to push notifications
					generateSubscribeEndPoint(newRegistration);
				}
			} catch (error) {
				toast.error(
					"Error during service worker registration or subscription:"
				);
			}
		} else {
			toast.error("Service workers are not supported in this browser");
		}
	}

	const generateSubscribeEndPoint = async (
		newRegistration: ServiceWorkerRegistration
	) => {
		try {
			const applicationServerKey = urlB64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_KEY!
			);

			// Check if there's an existing subscription
			const existingSubscription = await newRegistration.pushManager.getSubscription();
			
			// If subscription exists, unsubscribe first to avoid key mismatch errors
			if (existingSubscription) {
				try {
					await existingSubscription.unsubscribe();
				} catch (unsubscribeError) {
					console.warn("Error unsubscribing from existing subscription:", unsubscribeError);
					// Continue anyway - try to create new subscription
				}
			}

			const options: PushSubscriptionOptionsInit = {
				applicationServerKey: applicationServerKey as unknown as BufferSource,
				userVisibleOnly: true, // This ensures the delivery of notifications that are visible to the user, eliminating silent notifications. (Mandatory in Chrome, and optional in Firefox)
			};
			
			const subscription = await newRegistration.pushManager.subscribe(
				options
			);

			await createNotification(JSON.stringify(subscription));
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success("Notifications enabled!");
		} catch (error) {
			console.error("Subscription error:", error);
			if (error instanceof Error && error.message.includes("applicationServerKey")) {
				toast.error("Please disable notifications first, then enable them again.");
			} else {
				toast.error(error instanceof Error ? error.message : "Failed to enable notifications");
			}
		}
	};

	const removeNotification = async () => {
		try {
			// Unsubscribe from push notifications
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				const subscription = await registration.pushManager.getSubscription();
				if (subscription) {
					await subscription.unsubscribe();
				}
			}

			// Remove from database
			await removeNotificationAction();
			setNotificationPermission("denied");
			queryClient.invalidateQueries({ queryKey: ["user"] });
			toast.success("Notifications disabled");
		} catch (error) {
			console.error("Error removing notification:", error);
			toast.error(error instanceof Error ? error.message : "Failed to remove notification");
		}
	};

	useEffect(() => {
		setNotificationPermission(Notification.permission);
	}, []);

	if (isFetching) {
		return null;
	}
	return (
		<div className=" hover:scale-110 cursor-pointer transition-all">
			{notificationPermission === "granted" && user?.notification ? (
				<BellRing onClick={removeNotification} />
			) : (
				<BellOff onClick={showNotification} />
			)}
		</div>
	);
}
