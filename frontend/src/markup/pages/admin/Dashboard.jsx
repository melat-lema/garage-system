import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid, List, Users, ClipboardList, Wrench, Car, Settings } from "lucide-react";
import LayOut from "../../components/LayOut";
import AdminPanel from "./AdminPanel";

export default function AdminDashboardContent() {
  const menuCards = [
    {
      title: "All Orders",
      subtitle: "Open for All",
      action: "List of Orders",
      icon: <ClipboardList className="h-10 w-10 text-gray-600" />,
      link: "/admin/orders",
    },
    {
      title: "New Orders",
      subtitle: "Open for Leads",
      action: "Add Order",
      icon: <Grid className="h-10 w-10 text-gray-600" />,
      link: "/admin/new-order",
    },
    {
      title: "Employees",
      subtitle: "Open for Admins",
      action: "List of Employees",
      icon: <Users className="h-10 w-10 text-gray-600" />,
      link: "/admin/employees",
    },
    {
      title: "Add Employee",
      subtitle: "Open for Admins",
      action: "Read More",
      icon: <Users className="h-10 w-10 text-gray-600" />,
      link: "/admin/add-employee",
    },
    {
      title: "Denting & Painting",
      subtitle: "Service and Repairs",
      action: "Read More",
      icon: <Car className="h-10 w-10 text-gray-600" />,
      link: "/services/denting-painting",
    },
    {
      title: "Engine Service & Repair",
      subtitle: "Service and Repairs",
      action: "Read More",
      icon: <Wrench className="h-10 w-10 text-gray-600" />,
      link: "/services/engine-repair",
    },
    {
      title: "Tyre & Wheels",
      subtitle: "Service and Repairs",
      action: "Read More",
      icon: <Settings className="h-10 w-10 text-gray-600" />,
      link: "/services/tyres",
    },
  ];

  return (
    <LayOut>
         <div className="flex min-h-screen bg-gray-100">
            <AdminPanel />
              <main className="flex-1 p-8 bg-gray-50">
        
      <h1 className="text-3xl font-bold mb-2 text-blue-900">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bring to the table win-win survival strategies to ensure proactive domination. 
        Going forward, a new normal that has evolved from generation X is on the runway 
        heading towards a streamlined cloud solution.
      </p>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuCards.map((card, idx) => (
          <Card key={idx} className="shadow-md hover:shadow-lg transition">
            <CardContent className="flex flex-col justify-between h-40 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase text-gray-500">{card.subtitle}</p>
                  <h3 className="text-xl font-bold">{card.title}</h3>
                </div>
                {card.icon}
              </div>
              <Button
                asChild
                variant="link"
                className="text-red-600 px-0 font-semibold"
              >
                <a href={card.link}>{card.action} →</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
         </div>
      
    </LayOut>
  );
}
