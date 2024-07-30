import SongList from "@/components/list/index";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import AdminSetting from "@/components/basic/adminSetting";
import AdminSessionController from "@/components/basic/adminSessionControl";
import AdminFooter from "@/components/basic/adminFooter";

const AdminPage = async () => {
  const song = await prisma.song.findMany({
    orderBy: {
      createAt: "asc",
    },
  });

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto]">
      <section className="p-4 border-b sticky top-0 z-10 bg-background flex flex-col gap-2">
        <AdminSessionController />
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" className="w-full">
              ตั้งค่า
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader />
            <AdminSetting />
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  ปิดหน้าต่างนี้
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      <section
        className={cn("flex justify-center items-center px-0 overflow-clip")}>
        <SongList initData={song} type="admin" />
      </section>
      <AdminFooter />
    </main>
  );
};

export default AdminPage;
