
export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  categoria: string;
  precoBase: number;
  popular: boolean;
}

export interface VehicleCategory {
  id: string;
  nome: string;
  descricao: string;
  veiculos: Vehicle[];
}

export const vehicleCategories: VehicleCategory[] = [
  {
    id: 'populares',
    nome: 'Populares',
    descricao: 'Veículos econômicos e acessíveis',
    veiculos: [
      { id: 'v1', marca: 'Fiat', modelo: 'Mobi', categoria: 'populares', precoBase: 45000, popular: true },
      { id: 'v2', marca: 'Fiat', modelo: 'Argo', categoria: 'populares', precoBase: 55000, popular: true },
      { id: 'v3', marca: 'Chevrolet', modelo: 'Onix', categoria: 'populares', precoBase: 60000, popular: true },
      { id: 'v4', marca: 'Volkswagen', modelo: 'Polo', categoria: 'populares', precoBase: 70000, popular: true },
      { id: 'v5', marca: 'Hyundai', modelo: 'HB20', categoria: 'populares', precoBase: 58000, popular: true },
      { id: 'v6', marca: 'Renault', modelo: 'Kwid', categoria: 'populares', precoBase: 48000, popular: true },
      { id: 'v7', marca: 'Peugeot', modelo: '208', categoria: 'populares', precoBase: 65000, popular: true },
      { id: 'v8', marca: 'Nissan', modelo: 'March', categoria: 'populares', precoBase: 52000, popular: true },
      { id: 'v9', marca: 'Ford', modelo: 'Ka', categoria: 'populares', precoBase: 50000, popular: true },
      { id: 'v10', marca: 'Chevrolet', modelo: 'Prisma', categoria: 'populares', precoBase: 62000, popular: true }
    ]
  },
  {
    id: 'sedans',
    nome: 'Sedans',
    descricao: 'Conforto e elegância para o dia a dia',
    veiculos: [
      { id: 'v11', marca: 'Toyota', modelo: 'Corolla', categoria: 'sedans', precoBase: 120000, popular: true },
      { id: 'v12', marca: 'Honda', modelo: 'Civic', categoria: 'sedans', precoBase: 130000, popular: true },
      { id: 'v13', marca: 'Volkswagen', modelo: 'Jetta', categoria: 'sedans', precoBase: 115000, popular: true },
      { id: 'v14', marca: 'Nissan', modelo: 'Sentra', categoria: 'sedans', precoBase: 95000, popular: true },
      { id: 'v15', marca: 'Hyundai', modelo: 'Elantra', categoria: 'sedans', precoBase: 105000, popular: true },
      { id: 'v16', marca: 'Chevrolet', modelo: 'Cruze', categoria: 'sedans', precoBase: 110000, popular: true },
      { id: 'v17', marca: 'Peugeot', modelo: '408', categoria: 'sedans', precoBase: 98000, popular: true },
      { id: 'v18', marca: 'Renault', modelo: 'Logan', categoria: 'sedans', precoBase: 75000, popular: true },
      { id: 'v19', marca: 'Fiat', modelo: 'Cronos', categoria: 'sedans', precoBase: 68000, popular: true },
      { id: 'v20', marca: 'Toyota', modelo: 'Yaris', categoria: 'sedans', precoBase: 85000, popular: true }
    ]
  },
  {
    id: 'suvs',
    nome: 'SUVs',
    descricao: 'Versatilidade e robustez',
    veiculos: [
      { id: 'v21', marca: 'Hyundai', modelo: 'Creta', categoria: 'suvs', precoBase: 95000, popular: true },
      { id: 'v22', marca: 'Jeep', modelo: 'Renegade', categoria: 'suvs', precoBase: 110000, popular: true },
      { id: 'v23', marca: 'Volkswagen', modelo: 'T-Cross', categoria: 'suvs', precoBase: 85000, popular: true },
      { id: 'v24', marca: 'Nissan', modelo: 'Kicks', categoria: 'suvs', precoBase: 88000, popular: true },
      { id: 'v25', marca: 'Ford', modelo: 'EcoSport', categoria: 'suvs', precoBase: 80000, popular: true },
      { id: 'v26', marca: 'Chevrolet', modelo: 'Tracker', categoria: 'suvs', precoBase: 105000, popular: true },
      { id: 'v27', marca: 'Renault', modelo: 'Captur', categoria: 'suvs', precoBase: 92000, popular: true },
      { id: 'v28', marca: 'Peugeot', modelo: '2008', categoria: 'suvs', precoBase: 90000, popular: true },
      { id: 'v29', marca: 'Honda', modelo: 'HR-V', categoria: 'suvs', precoBase: 115000, popular: true },
      { id: 'v30', marca: 'Toyota', modelo: 'Corolla Cross', categoria: 'suvs', precoBase: 125000, popular: true }
    ]
  },
  {
    id: 'pickup',
    nome: 'Picapes',
    descricao: 'Força e capacidade de carga',
    veiculos: [
      { id: 'v31', marca: 'Fiat', modelo: 'Toro', categoria: 'pickup', precoBase: 135000, popular: true },
      { id: 'v32', marca: 'Volkswagen', modelo: 'Saveiro', categoria: 'pickup', precoBase: 75000, popular: true },
      { id: 'v33', marca: 'Chevrolet', modelo: 'S10', categoria: 'pickup', precoBase: 165000, popular: true },
      { id: 'v34', marca: 'Ford', modelo: 'Ranger', categoria: 'pickup', precoBase: 180000, popular: true },
      { id: 'v35', marca: 'Toyota', modelo: 'Hilux', categoria: 'pickup', precoBase: 195000, popular: true },
      { id: 'v36', marca: 'Nissan', modelo: 'Frontier', categoria: 'pickup', precoBase: 175000, popular: true },
      { id: 'v37', marca: 'Mitsubishi', modelo: 'L200', categoria: 'pickup', precoBase: 185000, popular: true },
      { id: 'v38', marca: 'Chevrolet', modelo: 'Montana', categoria: 'pickup', precoBase: 85000, popular: true },
      { id: 'v39', marca: 'Fiat', modelo: 'Strada', categoria: 'pickup', precoBase: 72000, popular: true },
      { id: 'v40', marca: 'Ram', modelo: '1500', categoria: 'pickup', precoBase: 220000, popular: true }
    ]
  }
];

export const getVehiclesByCategory = (categoryId: string): Vehicle[] => {
  const category = vehicleCategories.find(cat => cat.id === categoryId);
  return category ? category.veiculos : [];
};

export const getAllVehicles = (): Vehicle[] => {
  return vehicleCategories.flatMap(cat => cat.veiculos);
};

export const calculateVehiclePrice = (basePrice: number, year: number): number => {
  const currentYear = new Date().getFullYear();
  const depreciation = Math.max(0, (currentYear - year) * 0.08); // 8% por ano
  return Math.round(basePrice * (1 - depreciation));
};
