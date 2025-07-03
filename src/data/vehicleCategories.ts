
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
      { id: 'v1', marca: 'Fiat', modelo: 'Mobi', categoria: 'populares', precoBase: 58000, popular: true },
      { id: 'v2', marca: 'Fiat', modelo: 'Argo', categoria: 'populares', precoBase: 75000, popular: true },
      { id: 'v3', marca: 'Chevrolet', modelo: 'Onix', categoria: 'populares', precoBase: 78000, popular: true },
      { id: 'v4', marca: 'Volkswagen', modelo: 'Polo', categoria: 'populares', precoBase: 85000, popular: true },
      { id: 'v5', marca: 'Hyundai', modelo: 'HB20', categoria: 'populares', precoBase: 72000, popular: true },
      { id: 'v6', marca: 'Renault', modelo: 'Kwid', categoria: 'populares', precoBase: 55000, popular: true },
      { id: 'v7', marca: 'Peugeot', modelo: '208', categoria: 'populares', precoBase: 82000, popular: true },
      { id: 'v8', marca: 'Nissan', modelo: 'March', categoria: 'populares', precoBase: 65000, popular: true },
      { id: 'v9', marca: 'Ford', modelo: 'Ka', categoria: 'populares', precoBase: 62000, popular: true },
      { id: 'v10', marca: 'Chevrolet', modelo: 'Prisma', categoria: 'populares', precoBase: 70000, popular: true },
      { id: 'v11', marca: 'Chevrolet', modelo: 'Celta', categoria: 'populares', precoBase: 35000, popular: true },
      { id: 'v12', marca: 'Volkswagen', modelo: 'Gol', categoria: 'populares', precoBase: 58000, popular: true },
      { id: 'v13', marca: 'Fiat', modelo: 'Siena', categoria: 'populares', precoBase: 52000, popular: true },
      { id: 'v14', marca: 'Fiat', modelo: 'Palio', categoria: 'populares', precoBase: 48000, popular: true },
      { id: 'v15', marca: 'Chevrolet', modelo: 'Corsa', categoria: 'populares', precoBase: 42000, popular: true }
    ]
  },
  {
    id: 'sedans',
    nome: 'Sedans',
    descricao: 'Conforto e elegância para o dia a dia',
    veiculos: [
      { id: 'v21', marca: 'Toyota', modelo: 'Corolla', categoria: 'sedans', precoBase: 135000, popular: true },
      { id: 'v22', marca: 'Honda', modelo: 'Civic', categoria: 'sedans', precoBase: 145000, popular: true },
      { id: 'v23', marca: 'Volkswagen', modelo: 'Jetta', categoria: 'sedans', precoBase: 125000, popular: true },
      { id: 'v24', marca: 'Nissan', modelo: 'Sentra', categoria: 'sedans', precoBase: 105000, popular: true },
      { id: 'v25', marca: 'Hyundai', modelo: 'Elantra', categoria: 'sedans', precoBase: 115000, popular: true },
      { id: 'v26', marca: 'Chevrolet', modelo: 'Cruze', categoria: 'sedans', precoBase: 120000, popular: true },
      { id: 'v27', marca: 'Peugeot', modelo: '408', categoria: 'sedans', precoBase: 110000, popular: true },
      { id: 'v28', marca: 'Renault', modelo: 'Logan', categoria: 'sedans', precoBase: 85000, popular: true },
      { id: 'v29', marca: 'Fiat', modelo: 'Cronos', categoria: 'sedans', precoBase: 78000, popular: true },
      { id: 'v30', marca: 'Toyota', modelo: 'Yaris', categoria: 'sedans', precoBase: 95000, popular: true },
      { id: 'v31', marca: 'Volkswagen', modelo: 'Virtus', categoria: 'sedans', precoBase: 88000, popular: true },
      { id: 'v32', marca: 'Hyundai', modelo: 'HB20S', categoria: 'sedans', precoBase: 82000, popular: true },
      { id: 'v33', marca: 'Volkswagen', modelo: 'Golf', categoria: 'sedans', precoBase: 98000, popular: true }
    ]
  },
  {
    id: 'suvs',
    nome: 'SUVs',
    descricao: 'Versatilidade e robustez',
    veiculos: [
      { id: 'v41', marca: 'Hyundai', modelo: 'Creta', categoria: 'suvs', precoBase: 112000, popular: true },
      { id: 'v42', marca: 'Jeep', modelo: 'Renegade', categoria: 'suvs', precoBase: 125000, popular: true },
      { id: 'v43', marca: 'Volkswagen', modelo: 'T-Cross', categoria: 'suvs', precoBase: 98000, popular: true },
      { id: 'v44', marca: 'Nissan', modelo: 'Kicks', categoria: 'suvs', precoBase: 102000, popular: true },
      { id: 'v45', marca: 'Ford', modelo: 'EcoSport', categoria: 'suvs', precoBase: 92000, popular: true },
      { id: 'v46', marca: 'Chevrolet', modelo: 'Tracker', categoria: 'suvs', precoBase: 118000, popular: true },
      { id: 'v47', marca: 'Renault', modelo: 'Captur', categoria: 'suvs', precoBase: 105000, popular: true },
      { id: 'v48', marca: 'Peugeot', modelo: '2008', categoria: 'suvs', precoBase: 108000, popular: true },
      { id: 'v49', marca: 'Honda', modelo: 'HR-V', categoria: 'suvs', precoBase: 128000, popular: true },
      { id: 'v50', marca: 'Toyota', modelo: 'Corolla Cross', categoria: 'suvs', precoBase: 138000, popular: true },
      { id: 'v51', marca: 'Jeep', modelo: 'Compass', categoria: 'suvs', precoBase: 145000, popular: true },
      { id: 'v52', marca: 'Fiat', modelo: 'Pulse', categoria: 'suvs', precoBase: 88000, popular: true }
    ]
  },
  {
    id: 'pickup',
    nome: 'Picapes',
    descricao: 'Força e capacidade de carga',
    veiculos: [
      { id: 'v61', marca: 'Fiat', modelo: 'Toro', categoria: 'pickup', precoBase: 148000, popular: true },
      { id: 'v62', marca: 'Volkswagen', modelo: 'Saveiro', categoria: 'pickup', precoBase: 82000, popular: true },
      { id: 'v63', marca: 'Chevrolet', modelo: 'S10', categoria: 'pickup', precoBase: 185000, popular: true },
      { id: 'v64', marca: 'Ford', modelo: 'Ranger', categoria: 'pickup', precoBase: 198000, popular: true },
      { id: 'v65', marca: 'Toyota', modelo: 'Hilux', categoria: 'pickup', precoBase: 215000, popular: true },
      { id: 'v66', marca: 'Nissan', modelo: 'Frontier', categoria: 'pickup', precoBase: 192000, popular: true },
      { id: 'v67', marca: 'Mitsubishi', modelo: 'L200', categoria: 'pickup', precoBase: 202000, popular: true },
      { id: 'v68', marca: 'Chevrolet', modelo: 'Montana', categoria: 'pickup', precoBase: 92000, popular: true },
      { id: 'v69', marca: 'Fiat', modelo: 'Strada', categoria: 'pickup', precoBase: 78000, popular: true },
      { id: 'v70', marca: 'Ram', modelo: '1500', categoria: 'pickup', precoBase: 245000, popular: true }
    ]
  },
  {
    id: 'motos',
    nome: 'Motocicletas',
    descricao: 'Agilidade e economia no trânsito',
    veiculos: [
      { id: 'm1', marca: 'Honda', modelo: 'CG 160 Titan', categoria: 'motos', precoBase: 12500, popular: true },
      { id: 'm2', marca: 'Honda', modelo: 'CG 125 Fan', categoria: 'motos', precoBase: 11200, popular: true },
      { id: 'm3', marca: 'Yamaha', modelo: 'Factor 125', categoria: 'motos', precoBase: 11800, popular: true },
      { id: 'm4', marca: 'Honda', modelo: 'Biz 125', categoria: 'motos', precoBase: 10800, popular: true },
      { id: 'm5', marca: 'Yamaha', modelo: 'XTZ 150 Crosser', categoria: 'motos', precoBase: 15200, popular: true },
      { id: 'm6', marca: 'Honda', modelo: 'Bros 160', categoria: 'motos', precoBase: 14800, popular: true },
      { id: 'm7', marca: 'Suzuki', modelo: 'GSX-S 150', categoria: 'motos', precoBase: 13500, popular: true },
      { id: 'm8', marca: 'Yamaha', modelo: 'MT-03', categoria: 'motos', precoBase: 22500, popular: true },
      { id: 'm9', marca: 'Honda', modelo: 'CB 600F Hornet', categoria: 'motos', precoBase: 35000, popular: true },
      { id: 'm10', marca: 'Kawasaki', modelo: 'Ninja 400', categoria: 'motos', precoBase: 28000, popular: true },
      { id: 'm11', marca: 'Yamaha', modelo: 'Fazer 250', categoria: 'motos', precoBase: 18500, popular: true },
      { id: 'm12', marca: 'Honda', modelo: 'PCX 150', categoria: 'motos', precoBase: 16800, popular: true }
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

export const operators = [
  { id: 'maria', nome: 'Maria Eduarda', telefone: '(61) 98483-3965' },
  { id: 'samuel', nome: 'Samuel Silva', telefone: '(61) 98483-3966' },
  { id: 'isac', nome: 'Isac Ferreira', telefone: '(61) 98483-3967' }
];
