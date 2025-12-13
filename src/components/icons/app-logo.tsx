
import type { SVGProps } from 'react';
import { School } from 'lucide-react'; // Using a standard icon for consistency

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  // Using Lucide's School icon as the base for the app logo
  return <School {...props} />;
}
