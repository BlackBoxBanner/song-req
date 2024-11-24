"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AnnouncementType = {
	title: string;
	description: string;
	endDate: string;
	link?: string;
}

const announcement: AnnouncementType[] = [
	{
		title: "กิจกรรมสุดมันส์ - เกมซ่อนหา",
		description: "ค้นหาโค้ดลับที่ถูกซ่อนอยู่ในเว็ปไซต์ของเรา และส่งคำตอบเพื่อรับรางวัล!",
		endDate: "2025-01-01T00:00:00Z",
		link: "/ctf",
	},
]


const fetchAnnounced = async (): Promise<AnnouncementType[]> => {
	try {
		const res = await fetch("/api/announcement");
		if (!res.ok) {
			// Log error with specific status code or message
			console.error(`Failed to fetch announcements: ${res.status} ${res.statusText}`);
			return [];
		}

		const data = await res.json();
		return (data.announcement || []) as AnnouncementType[];
	} catch (error) {
		console.error("Error fetching announcements:", error);
		// Return an empty array to ensure consistent return type
		return [];
	}
};

const setAnnouncedCookie = async (announces: AnnouncementType[]): Promise<AnnouncementType[] | null> => {
	try {
		const res = await fetch("/api/announcement", {
			method: "POST",
			body: JSON.stringify({
				announcement: announces.map(({ title, description }) => ({ title, description })),
			}),
		});

		if (!res.ok) {
			console.error(`Failed to set announcements: ${res.status} ${res.statusText}`);
			return null;
		}

		const data = await res.json();
		return (data.announcement || []) as AnnouncementType[];
	} catch (error) {
		console.error("Error setting announcements:", error);
		return null;
	}
};

const Announcement = () => {

	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	const handler = async () => {
		const announced = await fetchAnnounced();

		if (!announced) return;

		const announceNames = announced.map(({ title }) => title);

		// filter out the announcement that has been announced
		const filteredAnnouncement = announcement.filter(({ title }) => !announceNames.includes(title) && new Date().getTime() <= new Date().getTime());

		filteredAnnouncement.forEach(({ title, description, link }) => {
			toast(title, {
				description,
				position: "top-right",
				action: {
					label: "ดูเพิ่มเติม",
					onClick: () => link ? router.push(link) : null,
				},
			});
		})

		// Set the announced cookie
		await setAnnouncedCookie(announcement);
	}

	useEffect(() => {
		if (!isMounted) return setIsMounted(true);

		handler();
		return () => {
			setIsMounted(true);
		};

	}, [isMounted]);

	return <></>;
};

export default Announcement;