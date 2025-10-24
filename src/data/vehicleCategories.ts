export interface VehicleModel {
  name: string;
  price: number;
  year: number;
}

export interface VehicleBrand {
  name: string;
  models: VehicleModel[];
}

export interface VehicleCategory {
  name: string;
  brands: VehicleBrand[];
}

export const vehicleCategories: VehicleCategory[] = [
  {
    name: 'Populares',
    brands: [
      {
        name: 'Fiat',
        models: [
          { name: 'Mobi', price: 58000, year: 2024 },
          { name: 'Argo', price: 75000, year: 2024 },
          { name: 'Siena', price: 52000, year: 2020 },
          { name: 'Siena EL 1.0', price: 26000, year: 2012 },
          { name: 'Palio', price: 48000, year: 2019 },
          { name: 'Palio Fire', price: 28000, year: 2010 },
          { name: 'Palio EX', price: 18000, year: 2005 },
          { name: 'Palio Weekend', price: 30000, year: 2008 },
          { name: 'Uno Mille', price: 22000, year: 2011 },
          { name: 'Uno Vivace', price: 35000, year: 2015 },
          { name: 'Uno Way', price: 38000, year: 2013 },
          { name: 'Uno Fire', price: 20000, year: 2007 },
          { name: 'Cronos', price: 78000, year: 2024 },
          { name: 'Punto', price: 32000, year: 2013 },
          { name: 'Strada Working', price: 45000, year: 2012 }
        ]
      },
      {
        name: 'Chevrolet',
        models: [
          { name: 'Onix', price: 78000, year: 2024 },
          { name: 'Prisma', price: 70000, year: 2023 },
          { name: 'Celta', price: 35000, year: 2018 },
          { name: 'Celta Life', price: 18000, year: 2009 },
          { name: 'Corsa', price: 42000, year: 2019 },
          { name: 'Corsa Sedan', price: 20000, year: 2008 },
          { name: 'Classic', price: 22000, year: 2010 },
          { name: 'Agile', price: 25000, year: 2012 }
        ]
      },
      {
        name: 'Volkswagen',
        models: [
          { name: 'Polo', price: 85000, year: 2024 },
          { name: 'Gol', price: 58000, year: 2023 },
          { name: 'Gol G5 1.6', price: 28000, year: 2012 },
          { name: 'Gol G4 1.0', price: 24000, year: 2011 },
          { name: 'Gol G4', price: 22000, year: 2009 },
          { name: 'Gol G3 1.0', price: 16000, year: 2005 },
          { name: 'Gol G3', price: 14000, year: 2004 },
          { name: 'Gol G2', price: 12000, year: 2000 },
          { name: 'Virtus', price: 88000, year: 2024 },
          { name: 'Fox', price: 32000, year: 2015 },
          { name: 'Fox Plus', price: 28000, year: 2010 },
          { name: 'Voyage', price: 38000, year: 2016 },
          { name: 'Voyage 1.6', price: 30000, year: 2010 },
          { name: 'Up!', price: 45000, year: 2018 }
        ]
      },
      {
        name: 'Hyundai',
        models: [
          { name: 'HB20', price: 72000, year: 2024 },
          { name: 'HB20S', price: 82000, year: 2024 },
          { name: 'i30', price: 45000, year: 2013 }
        ]
      },
      {
        name: 'Renault',
        models: [
          { name: 'Kwid', price: 55000, year: 2024 },
          { name: 'Logan', price: 85000, year: 2024 },
          { name: 'Sandero', price: 35000, year: 2014 },
          { name: 'Clio', price: 24000, year: 2010 }
        ]
      },
      {
        name: 'Ford',
        models: [
          { name: 'Ka', price: 38000, year: 2018 },
          { name: 'Ka+', price: 45000, year: 2020 },
          { name: 'Fiesta', price: 28000, year: 2011 },
          { name: 'Focus', price: 32000, year: 2012 }
        ]
      }
    ]
  },
  {
    name: 'Sedans',
    brands: [
      {
        name: 'Toyota',
        models: [
          { name: 'Corolla', price: 135000, year: 2024 },
          { name: 'Yaris', price: 95000, year: 2024 }
        ]
      },
      {
        name: 'Honda',
        models: [
          { name: 'Civic', price: 145000, year: 2024 }
        ]
      },
      {
        name: 'Volkswagen',
        models: [
          { name: 'Jetta', price: 125000, year: 2024 }
        ]
      },
      {
        name: 'Nissan',
        models: [
          { name: 'Sentra', price: 105000, year: 2024 }
        ]
      },
      {
        name: 'Hyundai',
        models: [
          { name: 'Elantra', price: 115000, year: 2024 }
        ]
      }
    ]
  },
  {
    name: 'SUVs',
    brands: [
      {
        name: 'Hyundai',
        models: [
          { name: 'Creta', price: 112000, year: 2024 }
        ]
      },
      {
        name: 'Jeep',
        models: [
          { name: 'Renegade', price: 125000, year: 2024 },
          { name: 'Compass', price: 145000, year: 2024 }
        ]
      },
      {
        name: 'Volkswagen',
        models: [
          { name: 'T-Cross', price: 98000, year: 2024 }
        ]
      },
      {
        name: 'Nissan',
        models: [
          { name: 'Kicks', price: 102000, year: 2024 }
        ]
      },
      {
        name: 'Ford',
        models: [
          { name: 'EcoSport', price: 92000, year: 2023 }
        ]
      },
      {
        name: 'Toyota',
        models: [
          { name: 'Corolla Cross', price: 138000, year: 2024 }
        ]
      }
    ]
  },
  {
    name: 'Picapes',
    brands: [
      {
        name: 'Fiat',
        models: [
          { name: 'Toro', price: 148000, year: 2024 },
          { name: 'Strada', price: 78000, year: 2024 }
        ]
      },
      {
        name: 'Volkswagen',
        models: [
          { name: 'Saveiro', price: 82000, year: 2024 }
        ]
      },
      {
        name: 'Chevrolet',
        models: [
          { name: 'S10', price: 185000, year: 2024 },
          { name: 'Montana', price: 92000, year: 2024 }
        ]
      },
      {
        name: 'Ford',
        models: [
          { name: 'Ranger', price: 198000, year: 2024 }
        ]
      },
      {
        name: 'Toyota',
        models: [
          { name: 'Hilux', price: 215000, year: 2024 }
        ]
      }
    ]
  },
  {
    name: 'Motocicletas',
    brands: [
      {
        name: 'Honda',
        models: [
          { name: 'CG 160 Start', price: 11800, year: 2023 },
          { name: 'CG 160 Titan', price: 12500, year: 2024 },
          { name: 'CG 160 Fan', price: 13000, year: 2022 },
          { name: 'CG 150 Titan', price: 9500, year: 2015 },
          { name: 'CG 150 Fan', price: 8800, year: 2012 },
          { name: 'CG 125 Fan', price: 11200, year: 2024 },
          { name: 'CG 125 Titan', price: 6500, year: 2008 },
          { name: 'CG 125 Cargo', price: 7200, year: 2010 },
          { name: 'Biz 125', price: 10800, year: 2024 },
          { name: 'Biz 110i', price: 9200, year: 2020 },
          { name: 'Biz 100', price: 5800, year: 2010 },
          { name: 'Bros 160', price: 14800, year: 2024 },
          { name: 'Bros 150', price: 10500, year: 2012 },
          { name: 'Bros 125', price: 8000, year: 2008 },
          { name: 'PCX 150', price: 16800, year: 2024 },
          { name: 'PCX 125', price: 14500, year: 2018 },
          { name: 'Pop 110i', price: 9800, year: 2022 },
          { name: 'Pop 100', price: 6500, year: 2012 },
          { name: 'CB 300R', price: 18500, year: 2020 },
          { name: 'NC 750X', price: 32000, year: 2018 },
          { name: 'XRE 300', price: 22000, year: 2016 }
        ]
      },
      {
        name: 'Yamaha',
        models: [
          { name: 'Factor 125', price: 11800, year: 2024 },
          { name: 'Factor 125i', price: 9200, year: 2016 },
          { name: 'XTZ 150 Crosser', price: 15200, year: 2024 },
          { name: 'XTZ 125', price: 8500, year: 2010 },
          { name: 'MT-03', price: 22500, year: 2024 },
          { name: 'Fazer 250', price: 18500, year: 2024 },
          { name: 'Fazer 150', price: 9800, year: 2013 },
          { name: 'YBR 125', price: 6200, year: 2008 }
        ]
      },
      {
        name: 'Suzuki',
        models: [
          { name: 'GSX-S 150', price: 13500, year: 2024 },
          { name: 'Intruder 125', price: 10200, year: 2018 },
          { name: 'Yes 125', price: 6800, year: 2010 }
        ]
      },
      {
        name: 'Kawasaki',
        models: [
          { name: 'Ninja 400', price: 28000, year: 2024 },
          { name: 'Ninja 250', price: 18000, year: 2012 }
        ]
      }
    ]
  }
];

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  categoria: string;
  precoBase: number;
  popular: boolean;
}

export const getVehiclesByCategory = (categoryId: string): Vehicle[] => {
  const category = vehicleCategories.find(cat => cat.name === categoryId);
  if (!category) return [];
  
  const vehicles: Vehicle[] = [];
  category.brands.forEach(brand => {
    brand.models.forEach(model => {
      vehicles.push({
        id: `${brand.name}-${model.name}`.toLowerCase().replace(/\s+/g, '-'),
        marca: brand.name,
        modelo: model.name,
        categoria: category.name,
        precoBase: model.price,
        popular: true
      });
    });
  });
  
  return vehicles;
};

export const getAllVehicles = (): Vehicle[] => {
  return vehicleCategories.flatMap(cat => getVehiclesByCategory(cat.name));
};

export const calculateVehiclePrice = (basePrice: number, year: number): number => {
  const currentYear = new Date().getFullYear();
  const depreciation = Math.max(0, (currentYear - year) * 0.08);
  return Math.round(basePrice * (1 - depreciation));
};

export const operators = [
  { id: 'maria', nome: 'Maria Eduarda', telefone: '(61) 98483-3965' },
  { id: 'samuel', nome: 'Samuel Silva', telefone: '(61) 98483-3966' },
  { id: 'isac', nome: 'Isac Ferreira', telefone: '(61) 98483-3967' }
];
