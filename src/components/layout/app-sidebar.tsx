'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Pill,
  LayoutDashboard,
  BotMessageSquare,
  Factory,
  ScanLine,
  ShoppingCart,
  Search,
} from 'lucide-react';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { useCart } from '@/context/cart-context';

export function AppSidebar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Pill className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight font-headline">
              PharmaConnect
            </h2>
            <p className="text-xs text-muted-foreground">
              By Direct Manufacturers
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/')}
              tooltip="Dashboard"
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Medicines</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/suggestions')}
              tooltip="AI Suggestions"
            >
              <Link href="/suggestions">
                <BotMessageSquare />
                <span>AI Suggestions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/cart')}
              tooltip="My Cart"
            >
              <Link href="/cart">
                <ShoppingCart />
                <span>My Cart</span>
                 {cartCount > 0 && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/scan')}
              tooltip="Scan Receipt"
            >
              <Link href="/scan">
                <ScanLine />
                <span>Scan Receipt</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/find-manufacturer')}
              tooltip="Find Manufacturer"
            >
              <Link href="/find-manufacturer">
                <Search />
                <span>Find Manufacturer</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/manufacturer')}
              tooltip="Manufacturer Portal"
            >
              <Link href="/manufacturer/login">
                <Factory />
                <span>Manufacturer Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full">
          Need Help?
        </Button>
      </SidebarFooter>
    </>
  );
}
