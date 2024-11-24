import CountdownTimer from "@/components/basic/CountdownTimer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTFPage = () => {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-800">
			<div className="container mx-auto py-10 lg:px-12 px-4">
				<header className="text-center mb-10">
					<h1 className="text-4xl font-bold text-indigo-600 mb-4">🎉 เกมซ่อนหา: ท้าทายความสามารถของคุณ 🎉</h1>
					<p className="text-lg text-gray-600">
						ยินดีต้อนรับสู่กิจกรรมสุดมันส์ “เกมซ่อนหา” ที่จะทดสอบไหวพริบและความเร็วของคุณ!
						ค้นหาโค้ดลับพร้อมลุ้นรับ รางวัลเงินสดมูลค่าสูงสุด <span className="font-semibold text-indigo-500">1,000 บาท</span>.
					</p>
					<p className="text-lg text-gray-600">
						เตรียมตัวให้พร้อมและมาเป็นผู้ชนะที่ค้นพบทุกโค้ดก่อนใคร!
					</p>
				</header>

				<div className="text-center mb-10">
					<CountdownTimer />
				</div>

				<div className="bg-white shadow rounded-lg p-6 mb-10">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 รายละเอียดกิจกรรม</h2>
					<p className="text-gray-700 mb-4">
						“เกมซ่อนหา” นี้ออกแบบมาเพื่อสร้างความสนุก ตื่นเต้น และความท้าทาย โดยมีกติกาดังนี้:
					</p>
					<ul className="list-inside text-gray-700 space-y-2">
						<li>
							เป้าหมาย: ค้นหาโค้ดลับทั้งหมด 4 ตัวที่ซ่อนอยู่ในรูปแบบ{" "}
							<code className="bg-gray-200 text-gray-800 px-2 py-1 rounded">sq{"{"}...{"}"}</code>.
						</li>
						<li>
							ระดับความยากของโค้ด: โค้ดลับแต่ละตัวมีรางวัลที่แตกต่างกันตามระดับความยาก:
							<ul className="list-inside ml-6 space-y-1">
								<li>✅ ง่าย: รางวัล 20 บาท</li>
								<li>⚡ ปานกลาง: รางวัล 50 บาท</li>
								<li>🔥 ยาก: รางวัล 100 บาท</li>
								<li>💎 ยากมาก: รางวัล 1,000 บาท</li>
							</ul>
						</li>
						<li>
							เงื่อนไข:
							ผู้ชนะคือคนแรกที่ค้นพบโค้ดลับและส่งคำตอบผ่านหน้าเว็บไซต์{" "}
							<Link
								href="/ctf/submit"
								target="_blank"
								rel="noopener noreferrer"
								className="text-indigo-500 underline"
							>
								Link
							</Link>.
						</li>
						<li>
							ระยะเวลาร่วมสนุก: กิจกรรมเริ่มตั้งแต่ 1 ธันวาคม 2024 และสิ้นสุดในวันที่ 1 มกราคม 2025.
							อย่าพลาด!
						</li>
						<li>
							<Link href={"/ctf/doc"} className="text-indigo-500 underline">อ่านเพิ่มเติม</Link>
						</li>
					</ul>
				</div>

				<div className="bg-white shadow rounded-lg p-6 mb-10">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 รางวัล</h2>
					<p className="text-gray-700 mb-4">
						รางวัลถูกแบ่งตามระดับความยากของโค้ดลับที่คุณค้นพบ โดยรายละเอียดมีดังนี้:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{ level: "ง่าย", prize: "20 บาท", color: "green" },
							{ level: "ปานกลาง", prize: "50 บาท", color: "blue" },
							{ level: "ยาก", prize: "100 บาท", color: "yellow" },
							{ level: "ยากมาก", prize: "1,000 บาท", color: "red" },
						].map((item, index) => (
							<div
								key={index}
								className={`p-6 bg-${item.color}-100 border border-${item.color}-300 rounded-lg text-center`}
							>
								<h3 className={`text-xl font-bold text-${item.color}-700 mb-2`}>ระดับ {item.level}</h3>
								<p className="text-lg text-gray-700">รางวัล: {item.prize}</p>
							</div>
						))}
					</div>
				</div>

				<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
					<h2 className="text-2xl font-bold text-indigo-600 mb-4">คุณพร้อมหรือยัง?</h2>
					<p className="text-gray-700 mb-4">
						อย่ารอช้า! โอกาสที่จะได้เป็นผู้ชนะคนแรกกำลังรอคุณอยู่
					</p>
					<a
						href="https://song.redbiiddsun.com/ctf/submit"
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-500 transition"
					>
						เริ่มเล่นเกมเลย!
					</a>
				</div>

				<footer className="text-center mt-12">
					<p className="text-gray-600">
						ขอให้โชคดีและสนุกกับการค้นหาโค้ดลับ! 🕵️‍♂️{" "}
						<span className="text-indigo-500">อย่าลืมแชร์กิจกรรมนี้กับเพื่อนของคุณ!</span>
					</p>
				</footer>
			</div>

			<section className="bg-primary text-primary-foreground flex flex-col md:flex-row justify-between items-center p-4 gap-4">
				{/* Left side: Copyright */}
				<div className="text-center md:text-left">
					<p className="text-sm">
						&copy; {new Date().getFullYear()} Sueksit Vachirakumthorn. All
						rights reserved.
					</p>
				</div>

				{/* Right side: Contact information */}
				<div className="flex flex-col md:flex-row gap-2">
					<Link href="https://sueksit.vercel.app/">
						<Button variant="link" className="text-primary-foreground">
							My Website
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
};

export default CTFPage;