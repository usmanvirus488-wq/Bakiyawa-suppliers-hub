export type Category = 'Sand' | 'Stones' | 'Equipment' | 'Others';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: string;
  unit: string;
  image: string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 's1',
    name: 'Shape Sand',
    category: 'Sand',
    price: '₦45,000 - ₦50,000',
    unit: 'per Truck',
    image: 'https://images.unsplash.com/photo-1589308454676-4daec3d7560a?auto=format&fit=crop&q=80&w=800',
    description: 'Fine sand, ideal for plastering and finishing work.'
  },
  {
    id: 's2',
    name: 'Pillister Sand',
    category: 'Sand',
    price: '₦40,000 - ₦45,000',
    unit: 'per Truck',
    image: 'https://images.unsplash.com/photo-1589139203649-43c22df723e7?auto=format&fit=crop&q=80&w=800',
    description: 'Perfect for blocks and general building construction.'
  },
  {
    id: 's3',
    name: 'Latret Sand',
    category: 'Sand',
    price: '₦40,000 - ₦100,000',
    unit: 'per Truck',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800',
    description: 'Coarse sand primarily used for foundations.'
  },
  {
    id: 'st1',
    name: 'Hardcore Stone',
    category: 'Stones',
    price: '₦130,000 - ₦300,000',
    unit: 'per Truck',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=800',
    description: 'Sturdy stones for foundation and heavy road works.'
  },
  {
    id: 'st2',
    name: 'Cravol',
    category: 'Stones',
    price: '₦15,000 - ₦17,000',
    unit: 'per Bag/Trip',
    image: 'https://images.unsplash.com/photo-1518005020250-ee29508f7466?auto=format&fit=crop&q=80&w=800',
    description: 'Mixed stone ideal for high-strength concrete.'
  },
  {
    id: 'st3',
    name: 'Stone Best',
    category: 'Stones',
    price: '₦15,000 - ₦17,000',
    unit: 'per Bag/Trip',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    description: 'High-quality finish stone for premium aesthetics.'
  },
  {
    id: 'e1',
    name: 'Truck Service',
    category: 'Equipment',
    price: '₦200,000 - ₦300,000',
    unit: 'per Trip',
    image: 'https://images.unsplash.com/photo-1591768793355-74d7c86a110a?auto=format&fit=crop&q=80&w=800',
    description: 'Professional delivery of all construction materials.'
  },
  {
    id: 'e2',
    name: 'Excavator Machine',
    category: 'Equipment',
    price: '₦500,000 - ₦1,000,000',
    unit: 'per Day',
    image: 'https://images.unsplash.com/photo-1579451996535-645620937666?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy machinery for site clearing and excavation.'
  },
  {
    id: 'o1',
    name: 'Water Tank Delivery',
    category: 'Others',
    price: '₦75,000 - ₦100,000',
    unit: 'per Trip',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    description: 'Bulk water supply for construction sites.'
  },
  {
    id: 'o2',
    name: 'Professional Workers',
    category: 'Others',
    price: '₦7,000 - ₦10,000',
    unit: 'per Day',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    description: 'Skilled labor available for site work and masonry.'
  },
  {
    id: 'o3',
    name: 'Agent Houses',
    category: 'Others',
    price: 'Custom Pricing',
    unit: 'per Quote',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    description: 'Contact us for custom house agency and property services.'
  }
];

export const SERVICES: Service[] = [
  { id: 'truck', name: 'Truck Service', icon: 'Truck', description: 'Logistics and delivery' },
  { id: 'excavator', name: 'Excavator Machine', icon: 'HardHat', description: 'Site clearing & work' },
  { id: 'worker', name: 'Pro Workers', icon: 'Users', description: 'Skilled construction labor' },
  { id: 'water', name: 'Water Tank', icon: 'Droplets', description: 'Bulk water delivery' }
];

export const CONTACT_INFO = {
  phones: ['0803 048 8968', '0812 742 6052'],
  whatsapp: '2348030488968',
  email: 'bakiyawasuppliershub@gmail.com',
  address: '📍 Guzape, Abuja, Nigeria'
};
