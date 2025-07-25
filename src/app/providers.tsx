
'use client';

import { UserProvider } from '@/context/user-context';
import { CartProvider } from '@/context/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UserProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </UserProvider>
    )
}
