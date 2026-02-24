export interface VehicleModel {
  id: string;
  name: string;
  years: string;
  engines: string[];
  image: string;
  partsCount: number;
  popular?: boolean;
}

export interface VehicleBrand {
  id: string;
  name: string;
  logo: string;
  country: string;
  models: VehicleModel[];
}

export interface VehicleCategory {
  id: 'passenger' | 'truck';
  name: string;
  icon: string;
  brands: VehicleBrand[];
}

export const vehicleCategories: VehicleCategory[] = [
  {
    id: 'passenger',
    name: 'Легкові автомобілі',
    icon: '🚗',
    brands: [
      {
        id: 'vw',
        name: 'Volkswagen',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'golf-7', name: 'Golf VII', years: '2012–2020', engines: ['1.4 TSI (150 к.с.)', '1.6 TDI (110 к.с.)', '2.0 TDI (150 к.с.)', '2.0 TSI GTI (230 к.с.)'], image: '🚗', partsCount: 4280, popular: true },
          { id: 'golf-8', name: 'Golf VIII', years: '2019–н.в.', engines: ['1.0 TSI (110 к.с.)', '1.5 TSI (150 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚗', partsCount: 2150 },
          { id: 'passat-b8', name: 'Passat B8', years: '2014–2023', engines: ['1.4 TSI (150 к.с.)', '1.8 TSI (180 к.с.)', '2.0 TDI (150 к.с.)', '2.0 TDI (190 к.с.)'], image: '🚗', partsCount: 3870, popular: true },
          { id: 'passat-b7', name: 'Passat B7', years: '2010–2014', engines: ['1.4 TSI (122 к.с.)', '1.8 TSI (160 к.с.)', '2.0 TDI (140 к.с.)'], image: '🚗', partsCount: 3540 },
          { id: 'tiguan-2', name: 'Tiguan II', years: '2016–н.в.', engines: ['1.4 TSI (150 к.с.)', '2.0 TSI (180 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚙', partsCount: 2980, popular: true },
          { id: 'touareg-3', name: 'Touareg III', years: '2018–н.в.', engines: ['3.0 TSI (340 к.с.)', '3.0 TDI (286 к.с.)'], image: '🚙', partsCount: 1820 },
          { id: 'polo-6', name: 'Polo VI', years: '2017–н.в.', engines: ['1.0 TSI (95 к.с.)', '1.0 TSI (115 к.с.)', '1.6 TDI (95 к.с.)'], image: '🚗', partsCount: 2340 },
          { id: 'caddy-5', name: 'Caddy V', years: '2020–н.в.', engines: ['1.5 TSI (114 к.с.)', '2.0 TDI (122 к.с.)'], image: '🚐', partsCount: 1650 },
          { id: 't-roc', name: 'T-Roc', years: '2017–н.в.', engines: ['1.0 TSI (115 к.с.)', '1.5 TSI (150 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚙', partsCount: 1920 },
        ],
      },
      {
        id: 'bmw',
        name: 'BMW',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'f30', name: '3 Series (F30)', years: '2011–2019', engines: ['320i (184 к.с.)', '330i (252 к.с.)', '320d (190 к.с.)', '330d (258 к.с.)'], image: '🚗', partsCount: 3950, popular: true },
          { id: 'g20', name: '3 Series (G20)', years: '2018–н.в.', engines: ['320i (184 к.с.)', '330i (258 к.с.)', '320d (190 к.с.)'], image: '🚗', partsCount: 2680 },
          { id: 'f10', name: '5 Series (F10)', years: '2010–2017', engines: ['520i (184 к.с.)', '528i (245 к.с.)', '520d (190 к.с.)', '530d (258 к.с.)'], image: '🚗', partsCount: 3720 },
          { id: 'g30', name: '5 Series (G30)', years: '2017–н.в.', engines: ['520i (184 к.с.)', '530i (252 к.с.)', '520d (190 к.с.)', '540i (340 к.с.)'], image: '🚗', partsCount: 2890 },
          { id: 'f15', name: 'X5 (F15)', years: '2013–2018', engines: ['xDrive35i (306 к.с.)', 'xDrive30d (258 к.с.)', 'xDrive40d (313 к.с.)'], image: '🚙', partsCount: 2750, popular: true },
          { id: 'g05', name: 'X5 (G05)', years: '2018–н.в.', engines: ['xDrive40i (340 к.с.)', 'xDrive30d (286 к.с.)', 'M50i (530 к.с.)'], image: '🚙', partsCount: 2120 },
          { id: 'f48', name: 'X1 (F48)', years: '2015–2022', engines: ['sDrive18i (140 к.с.)', 'xDrive20i (192 к.с.)', 'sDrive18d (150 к.с.)'], image: '🚙', partsCount: 2340 },
          { id: 'f25', name: 'X3 (F25)', years: '2010–2017', engines: ['xDrive20i (184 к.с.)', 'xDrive28i (245 к.с.)', 'xDrive20d (190 к.с.)'], image: '🚙', partsCount: 2560 },
        ],
      },
      {
        id: 'audi',
        name: 'Audi',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'a4-b9', name: 'A4 (B9)', years: '2015–н.в.', engines: ['2.0 TFSI (190 к.с.)', '2.0 TDI (150 к.с.)', '2.0 TDI (190 к.с.)'], image: '🚗', partsCount: 3120, popular: true },
          { id: 'a4-b8', name: 'A4 (B8)', years: '2007–2015', engines: ['1.8 TFSI (170 к.с.)', '2.0 TFSI (211 к.с.)', '2.0 TDI (143 к.с.)'], image: '🚗', partsCount: 3850 },
          { id: 'a6-c7', name: 'A6 (C7)', years: '2011–2018', engines: ['2.0 TFSI (252 к.с.)', '3.0 TDI (218 к.с.)', '3.0 TDI (272 к.с.)'], image: '🚗', partsCount: 3340 },
          { id: 'a6-c8', name: 'A6 (C8)', years: '2018–н.в.', engines: ['2.0 TFSI (245 к.с.)', '3.0 TDI (286 к.с.)'], image: '🚗', partsCount: 2180 },
          { id: 'q5-fy', name: 'Q5 (FY)', years: '2016–н.в.', engines: ['2.0 TFSI (252 к.с.)', '2.0 TDI (190 к.с.)', '3.0 TDI (286 к.с.)'], image: '🚙', partsCount: 2560, popular: true },
          { id: 'q7-4m', name: 'Q7 (4M)', years: '2015–н.в.', engines: ['3.0 TFSI (340 к.с.)', '3.0 TDI (272 к.с.)'], image: '🚙', partsCount: 2250 },
          { id: 'a3-8v', name: 'A3 (8V)', years: '2012–2020', engines: ['1.4 TFSI (150 к.с.)', '2.0 TFSI (190 к.с.)', '1.6 TDI (110 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚗', partsCount: 3450 },
        ],
      },
      {
        id: 'mercedes',
        name: 'Mercedes-Benz',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'w205', name: 'C-Class (W205)', years: '2014–2021', engines: ['C180 (156 к.с.)', 'C200 (184 к.с.)', 'C220d (194 к.с.)', 'C300 (258 к.с.)'], image: '🚗', partsCount: 3680, popular: true },
          { id: 'w206', name: 'C-Class (W206)', years: '2021–н.в.', engines: ['C180 (170 к.с.)', 'C200 (204 к.с.)', 'C220d (200 к.с.)'], image: '🚗', partsCount: 1850 },
          { id: 'w213', name: 'E-Class (W213)', years: '2016–н.в.', engines: ['E200 (184 к.с.)', 'E300 (258 к.с.)', 'E220d (194 к.с.)', 'E350d (286 к.с.)'], image: '🚗', partsCount: 3120 },
          { id: 'w167', name: 'GLE (W167)', years: '2019–н.в.', engines: ['GLE 300d (272 к.с.)', 'GLE 350 (258 к.с.)', 'GLE 450 (367 к.с.)'], image: '🚙', partsCount: 1920 },
          { id: 'w177', name: 'A-Class (W177)', years: '2018–н.в.', engines: ['A180 (136 к.с.)', 'A200 (163 к.с.)', 'A250 (224 к.с.)'], image: '🚗', partsCount: 2340 },
          { id: 'x253', name: 'GLC (X253)', years: '2015–2022', engines: ['GLC 200 (197 к.с.)', 'GLC 300 (258 к.с.)', 'GLC 220d (194 к.с.)'], image: '🚙', partsCount: 2780, popular: true },
        ],
      },
      {
        id: 'skoda',
        name: 'Škoda',
        logo: '🇨🇿',
        country: 'Чехія',
        models: [
          { id: 'octavia-a7', name: 'Octavia A7', years: '2012–2020', engines: ['1.4 TSI (150 к.с.)', '1.8 TSI (180 к.с.)', '1.6 TDI (110 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚗', partsCount: 3950, popular: true },
          { id: 'octavia-a8', name: 'Octavia A8', years: '2019–н.в.', engines: ['1.0 TSI (110 к.с.)', '1.5 TSI (150 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚗', partsCount: 2450 },
          { id: 'superb-3v', name: 'Superb III', years: '2015–н.в.', engines: ['1.4 TSI (150 к.с.)', '2.0 TSI (220 к.с.)', '2.0 TDI (150 к.с.)', '2.0 TDI (190 к.с.)'], image: '🚗', partsCount: 2890, popular: true },
          { id: 'kodiaq', name: 'Kodiaq', years: '2016–н.в.', engines: ['1.5 TSI (150 к.с.)', '2.0 TSI (190 к.с.)', '2.0 TDI (150 к.с.)', '2.0 TDI (190 к.с.)'], image: '🚙', partsCount: 2340 },
          { id: 'karoq', name: 'Karoq', years: '2017–н.в.', engines: ['1.0 TSI (115 к.с.)', '1.5 TSI (150 к.с.)', '2.0 TDI (150 к.с.)'], image: '🚙', partsCount: 1980 },
          { id: 'fabia-4', name: 'Fabia IV', years: '2021–н.в.', engines: ['1.0 MPI (80 к.с.)', '1.0 TSI (95 к.с.)', '1.0 TSI (110 к.с.)'], image: '🚗', partsCount: 1520 },
        ],
      },
      {
        id: 'toyota',
        name: 'Toyota',
        logo: '🇯🇵',
        country: 'Японія',
        models: [
          { id: 'camry-70', name: 'Camry XV70', years: '2017–н.в.', engines: ['2.0 (150 к.с.)', '2.5 (209 к.с.)', '2.5 Hybrid (218 к.с.)', '3.5 V6 (301 к.с.)'], image: '🚗', partsCount: 3150, popular: true },
          { id: 'corolla-e210', name: 'Corolla E210', years: '2018–н.в.', engines: ['1.2T (116 к.с.)', '1.8 Hybrid (122 к.с.)', '2.0 Hybrid (184 к.с.)'], image: '🚗', partsCount: 2780 },
          { id: 'rav4-xa50', name: 'RAV4 (XA50)', years: '2018–н.в.', engines: ['2.0 (173 к.с.)', '2.5 (203 к.с.)', '2.5 Hybrid (222 к.с.)'], image: '🚙', partsCount: 2560, popular: true },
          { id: 'land-cruiser-300', name: 'Land Cruiser 300', years: '2021–н.в.', engines: ['3.5 V6 Twin-Turbo (415 к.с.)', '3.3 V6 Diesel (309 к.с.)'], image: '🚙', partsCount: 1350 },
          { id: 'hilux-8', name: 'Hilux (AN120)', years: '2015–н.в.', engines: ['2.4 D-4D (150 к.с.)', '2.8 D-4D (204 к.с.)'], image: '🛻', partsCount: 2180 },
          { id: 'c-hr', name: 'C-HR', years: '2016–н.в.', engines: ['1.2T (116 к.с.)', '1.8 Hybrid (122 к.с.)', '2.0 Hybrid (184 к.с.)'], image: '🚙', partsCount: 1890 },
        ],
      },
      {
        id: 'renault',
        name: 'Renault',
        logo: '🇫🇷',
        country: 'Франція',
        models: [
          { id: 'megane-4', name: 'Mégane IV', years: '2015–2023', engines: ['1.3 TCe (140 к.с.)', '1.5 dCi (115 к.с.)', '1.6 dCi (130 к.с.)'], image: '🚗', partsCount: 2670 },
          { id: 'duster-2', name: 'Duster II', years: '2017–н.в.', engines: ['1.0 TCe (90 к.с.)', '1.3 TCe (150 к.с.)', '1.5 dCi (115 к.с.)'], image: '🚙', partsCount: 2340, popular: true },
          { id: 'kadjar', name: 'Kadjar', years: '2015–2022', engines: ['1.2 TCe (130 к.с.)', '1.3 TCe (140 к.с.)', '1.5 dCi (110 к.с.)'], image: '🚙', partsCount: 1980 },
          { id: 'clio-5', name: 'Clio V', years: '2019–н.в.', engines: ['1.0 TCe (90 к.с.)', '1.0 TCe (100 к.с.)', '1.3 TCe (130 к.с.)'], image: '🚗', partsCount: 1750 },
          { id: 'kangoo-3', name: 'Kangoo III', years: '2021–н.в.', engines: ['1.3 TCe (130 к.с.)', '1.5 dCi (95 к.с.)', '1.5 dCi (115 к.с.)'], image: '🚐', partsCount: 1420 },
        ],
      },
      {
        id: 'hyundai',
        name: 'Hyundai',
        logo: '🇰🇷',
        country: 'Південна Корея',
        models: [
          { id: 'tucson-nx4', name: 'Tucson (NX4)', years: '2020–н.в.', engines: ['1.6 T-GDi (150 к.с.)', '1.6 CRDi (136 к.с.)', '1.6 T-GDi Hybrid (230 к.с.)'], image: '🚙', partsCount: 2120, popular: true },
          { id: 'elantra-cn7', name: 'Elantra (CN7)', years: '2020–н.в.', engines: ['1.6 (123 к.с.)', '2.0 (150 к.с.)', '1.6 T-GDi (204 к.с.)'], image: '🚗', partsCount: 1890 },
          { id: 'i30-pd', name: 'i30 (PD)', years: '2016–н.в.', engines: ['1.0 T-GDi (120 к.с.)', '1.4 T-GDi (140 к.с.)', '1.6 CRDi (136 к.с.)'], image: '🚗', partsCount: 2450 },
          { id: 'santa-fe-tm', name: 'Santa Fe (TM)', years: '2018–н.в.', engines: ['2.2 CRDi (200 к.с.)', '2.5 GDi (180 к.с.)', '1.6 T-GDi Hybrid (230 к.с.)'], image: '🚙', partsCount: 2210, popular: true },
          { id: 'kona', name: 'Kona', years: '2017–н.в.', engines: ['1.0 T-GDi (120 к.с.)', '1.6 T-GDi (198 к.с.)', 'EV (204 к.с.)'], image: '🚙', partsCount: 1680 },
        ],
      },
      {
        id: 'kia',
        name: 'Kia',
        logo: '🇰🇷',
        country: 'Південна Корея',
        models: [
          { id: 'sportage-nq5', name: 'Sportage (NQ5)', years: '2021–н.в.', engines: ['1.6 T-GDi (150 к.с.)', '1.6 CRDi (136 к.с.)', '1.6 T-GDi HEV (230 к.с.)'], image: '🚙', partsCount: 1850, popular: true },
          { id: 'ceed-cd', name: 'Ceed (CD)', years: '2018–н.в.', engines: ['1.0 T-GDi (120 к.с.)', '1.5 T-GDi (160 к.с.)', '1.6 CRDi (136 к.с.)'], image: '🚗', partsCount: 2230 },
          { id: 'cerato-bd', name: 'Cerato (BD)', years: '2018–н.в.', engines: ['1.6 (128 к.с.)', '2.0 (150 к.с.)', '1.6 T-GDi (204 к.с.)'], image: '🚗', partsCount: 1980 },
          { id: 'sorento-mq4', name: 'Sorento (MQ4)', years: '2020–н.в.', engines: ['2.2 CRDi (202 к.с.)', '2.5 T-GDi (281 к.с.)', '1.6 T-GDi HEV (230 к.с.)'], image: '🚙', partsCount: 1720 },
          { id: 'niro-de', name: 'Niro (DE)', years: '2022–н.в.', engines: ['1.6 GDi HEV (141 к.с.)', '1.6 T-GDi PHEV (183 к.с.)', 'EV (204 к.с.)'], image: '🚙', partsCount: 1340 },
        ],
      },
      {
        id: 'ford',
        name: 'Ford',
        logo: '🇺🇸',
        country: 'США',
        models: [
          { id: 'focus-4', name: 'Focus IV', years: '2018–2025', engines: ['1.0 EcoBoost (125 к.с.)', '1.5 EcoBoost (150 к.с.)', '1.5 EcoBlue (120 к.с.)'], image: '🚗', partsCount: 2780, popular: true },
          { id: 'kuga-3', name: 'Kuga III', years: '2019–н.в.', engines: ['1.5 EcoBoost (150 к.с.)', '2.0 EcoBlue (150 к.с.)', '2.5 PHEV (225 к.с.)'], image: '🚙', partsCount: 2120 },
          { id: 'mondeo-5', name: 'Mondeo V', years: '2014–2022', engines: ['1.5 EcoBoost (160 к.с.)', '2.0 EcoBoost (240 к.с.)', '2.0 TDCi (150 к.с.)'], image: '🚗', partsCount: 2890 },
          { id: 'puma', name: 'Puma', years: '2019–н.в.', engines: ['1.0 EcoBoost (125 к.с.)', '1.0 EcoBoost mHEV (155 к.с.)'], image: '🚙', partsCount: 1560 },
          { id: 'transit-custom', name: 'Transit Custom', years: '2012–н.в.', engines: ['2.0 EcoBlue (130 к.с.)', '2.0 EcoBlue (170 к.с.)'], image: '🚐', partsCount: 3120 },
        ],
      },
      {
        id: 'nissan',
        name: 'Nissan',
        logo: '🇯🇵',
        country: 'Японія',
        models: [
          { id: 'qashqai-j12', name: 'Qashqai (J12)', years: '2021–н.в.', engines: ['1.3 DIG-T (140 к.с.)', '1.3 DIG-T mHEV (158 к.с.)', 'e-POWER (190 к.с.)'], image: '🚙', partsCount: 1670, popular: true },
          { id: 'x-trail-t33', name: 'X-Trail (T33)', years: '2022–н.в.', engines: ['1.5 VC-T e-POWER (213 к.с.)'], image: '🚙', partsCount: 1230 },
          { id: 'juke-f16', name: 'Juke (F16)', years: '2019–н.в.', engines: ['1.0 DIG-T (114 к.с.)', '1.6 Hybrid (143 к.с.)'], image: '🚙', partsCount: 1450 },
          { id: 'leaf-ze1', name: 'Leaf (ZE1)', years: '2017–н.в.', engines: ['EV 40kWh (150 к.с.)', 'EV 62kWh (217 к.с.)'], image: '🚗', partsCount: 1120 },
        ],
      },
      {
        id: 'mazda',
        name: 'Mazda',
        logo: '🇯🇵',
        country: 'Японія',
        models: [
          { id: 'mazda3-bp', name: 'Mazda3 (BP)', years: '2019–н.в.', engines: ['2.0 Skyactiv-G (122 к.с.)', '2.0 Skyactiv-X (186 к.с.)'], image: '🚗', partsCount: 1780, popular: true },
          { id: 'cx5-kf', name: 'CX-5 (KF)', years: '2017–н.в.', engines: ['2.0 Skyactiv-G (165 к.с.)', '2.5 Skyactiv-G (194 к.с.)', '2.2 Skyactiv-D (184 к.с.)'], image: '🚙', partsCount: 2340, popular: true },
          { id: 'cx-30', name: 'CX-30', years: '2019–н.в.', engines: ['2.0 Skyactiv-G (122 к.с.)', '2.0 Skyactiv-X (186 к.с.)'], image: '🚙', partsCount: 1560 },
          { id: 'mazda6-gj', name: 'Mazda6 (GJ)', years: '2012–2023', engines: ['2.0 Skyactiv-G (165 к.с.)', '2.5 Skyactiv-G (194 к.с.)', '2.2 Skyactiv-D (184 к.с.)'], image: '🚗', partsCount: 2670 },
        ],
      },
    ],
  },
  {
    id: 'truck',
    name: 'Вантажні автомобілі',
    icon: '🚛',
    brands: [
      {
        id: 'man',
        name: 'MAN',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'tgx', name: 'TGX', years: '2007–н.в.', engines: ['D2676 (440 к.с.)', 'D2676 (480 к.с.)', 'D2676 (540 к.с.)', 'D2676 (640 к.с.)'], image: '🚛', partsCount: 8450, popular: true },
          { id: 'tgs', name: 'TGS', years: '2007–н.в.', engines: ['D2066 (320 к.с.)', 'D2066 (360 к.с.)', 'D2676 (400 к.с.)', 'D2676 (440 к.с.)'], image: '🚛', partsCount: 7230, popular: true },
          { id: 'tgm', name: 'TGM', years: '2005–н.в.', engines: ['D0836 (250 к.с.)', 'D0836 (290 к.с.)', 'D0836 (340 к.с.)'], image: '🚚', partsCount: 5680 },
          { id: 'tgl', name: 'TGL', years: '2005–н.в.', engines: ['D0834 (150 к.с.)', 'D0834 (180 к.с.)', 'D0834 (220 к.с.)', 'D0836 (250 к.с.)'], image: '🚚', partsCount: 4560 },
          { id: 'tge', name: 'TGE', years: '2017–н.в.', engines: ['2.0 TDI (122 к.с.)', '2.0 TDI (140 к.с.)', '2.0 TDI (177 к.с.)'], image: '🚐', partsCount: 2890 },
        ],
      },
      {
        id: 'daf',
        name: 'DAF',
        logo: '🇳🇱',
        country: 'Нідерланди',
        models: [
          { id: 'xf-106', name: 'XF 106', years: '2013–2021', engines: ['MX-11 (430 к.с.)', 'MX-13 (460 к.с.)', 'MX-13 (510 к.с.)', 'MX-13 (530 к.с.)'], image: '🚛', partsCount: 7890, popular: true },
          { id: 'xg-plus', name: 'XG+', years: '2021–н.в.', engines: ['MX-11 (430 к.с.)', 'MX-13 (480 к.с.)', 'MX-13 (530 к.с.)'], image: '🚛', partsCount: 3450, popular: true },
          { id: 'xg', name: 'XG', years: '2021–н.в.', engines: ['MX-11 (390 к.с.)', 'MX-11 (430 к.с.)', 'MX-13 (480 к.с.)'], image: '🚛', partsCount: 3120 },
          { id: 'xd', name: 'XD', years: '2021–н.в.', engines: ['MX-11 (330 к.с.)', 'MX-11 (390 к.с.)', 'MX-11 (430 к.с.)'], image: '🚚', partsCount: 2780 },
          { id: 'cf', name: 'CF', years: '2013–н.в.', engines: ['MX-11 (330 к.с.)', 'MX-11 (370 к.с.)', 'MX-11 (430 к.с.)'], image: '🚚', partsCount: 6540 },
          { id: 'lf', name: 'LF', years: '2001–н.в.', engines: ['PX-5 (210 к.с.)', 'PX-7 (230 к.с.)', 'PX-7 (280 к.с.)', 'PX-7 (320 к.с.)'], image: '🚚', partsCount: 5230 },
        ],
      },
      {
        id: 'volvo-trucks',
        name: 'Volvo Trucks',
        logo: '🇸🇪',
        country: 'Швеція',
        models: [
          { id: 'fh-5', name: 'FH (5 покоління)', years: '2020–н.в.', engines: ['D13K (420 к.с.)', 'D13K (460 к.с.)', 'D13K (500 к.с.)', 'D13K (540 к.с.)'], image: '🚛', partsCount: 4120, popular: true },
          { id: 'fh-4', name: 'FH (4 покоління)', years: '2012–2021', engines: ['D13K (420 к.с.)', 'D13K (460 к.с.)', 'D13K (500 к.с.)', 'D13K (540 к.с.)'], image: '🚛', partsCount: 7560 },
          { id: 'fm-5', name: 'FM (5 покоління)', years: '2020–н.в.', engines: ['D11K (330 к.с.)', 'D11K (380 к.с.)', 'D13K (420 к.с.)', 'D13K (460 к.с.)'], image: '🚛', partsCount: 3780, popular: true },
          { id: 'fe', name: 'FE', years: '2006–н.в.', engines: ['D8K (250 к.с.)', 'D8K (280 к.с.)', 'D8K (320 к.с.)'], image: '🚚', partsCount: 4120 },
          { id: 'fl', name: 'FL', years: '2006–н.в.', engines: ['D5K (210 к.с.)', 'D5K (240 к.с.)', 'D8K (250 к.с.)', 'D8K (280 к.с.)'], image: '🚚', partsCount: 3560 },
          { id: 'fmx', name: 'FMX', years: '2010–н.в.', engines: ['D11K (380 к.с.)', 'D13K (420 к.с.)', 'D13K (460 к.с.)', 'D13K (500 к.с.)'], image: '🚛', partsCount: 3890 },
        ],
      },
      {
        id: 'scania',
        name: 'Scania',
        logo: '🇸🇪',
        country: 'Швеція',
        models: [
          { id: 'r-series', name: 'R-series', years: '2016–н.в.', engines: ['DC13 (410 к.с.)', 'DC13 (450 к.с.)', 'DC13 (500 к.с.)', 'DC13 (540 к.с.)', 'DC16 (650 к.с.)'], image: '🚛', partsCount: 6890, popular: true },
          { id: 's-series', name: 'S-series', years: '2016–н.в.', engines: ['DC13 (450 к.с.)', 'DC13 (500 к.с.)', 'DC13 (540 к.с.)', 'DC16 (650 к.с.)', 'DC16 (730 к.с.)'], image: '🚛', partsCount: 5670, popular: true },
          { id: 'g-series', name: 'G-series', years: '2016–н.в.', engines: ['DC09 (280 к.с.)', 'DC09 (320 к.с.)', 'DC09 (360 к.с.)', 'DC13 (410 к.с.)'], image: '🚛', partsCount: 4890 },
          { id: 'p-series', name: 'P-series', years: '2016–н.в.', engines: ['DC07 (220 к.с.)', 'DC07 (260 к.с.)', 'DC09 (280 к.с.)', 'DC09 (320 к.с.)'], image: '🚚', partsCount: 4230 },
          { id: 'l-series', name: 'L-series', years: '2018–н.в.', engines: ['DC07 (220 к.с.)', 'DC07 (260 к.с.)', 'DC09 (280 к.с.)'], image: '🚚', partsCount: 2890 },
        ],
      },
      {
        id: 'mercedes-trucks',
        name: 'Mercedes-Benz Trucks',
        logo: '🇩🇪',
        country: 'Німеччина',
        models: [
          { id: 'actros-mp5', name: 'Actros (MP5)', years: '2019–н.в.', engines: ['OM471 (428 к.с.)', 'OM471 (449 к.с.)', 'OM471 (476 к.с.)', 'OM471 (530 к.с.)'], image: '🚛', partsCount: 5230, popular: true },
          { id: 'actros-mp4', name: 'Actros (MP4)', years: '2011–2019', engines: ['OM470 (360 к.с.)', 'OM471 (421 к.с.)', 'OM471 (449 к.с.)', 'OM471 (510 к.с.)'], image: '🚛', partsCount: 7890 },
          { id: 'arocs', name: 'Arocs', years: '2013–н.в.', engines: ['OM470 (360 к.с.)', 'OM471 (421 к.с.)', 'OM471 (510 к.с.)', 'OM473 (625 к.с.)'], image: '🚛', partsCount: 4560 },
          { id: 'atego', name: 'Atego', years: '2013–н.в.', engines: ['OM934 (156 к.с.)', 'OM934 (177 к.с.)', 'OM936 (231 к.с.)', 'OM936 (272 к.с.)', 'OM936 (299 к.с.)'], image: '🚚', partsCount: 5670, popular: true },
          { id: 'axor', name: 'Axor', years: '2001–2013', engines: ['OM457 (354 к.с.)', 'OM457 (408 к.с.)', 'OM457 (428 к.с.)'], image: '🚛', partsCount: 6120 },
          { id: 'sprinter-907', name: 'Sprinter (W907)', years: '2018–н.в.', engines: ['OM654 (143 к.с.)', 'OM654 (170 к.с.)', 'OM654 (190 к.с.)'], image: '🚐', partsCount: 3890 },
        ],
      },
      {
        id: 'iveco',
        name: 'Iveco',
        logo: '🇮🇹',
        country: 'Італія',
        models: [
          { id: 's-way', name: 'S-Way', years: '2019–н.в.', engines: ['Cursor 11 (430 к.с.)', 'Cursor 11 (460 к.с.)', 'Cursor 13 (490 к.с.)', 'Cursor 13 (570 к.с.)'], image: '🚛', partsCount: 3560, popular: true },
          { id: 'stralis', name: 'Stralis', years: '2002–2019', engines: ['Cursor 8 (310 к.с.)', 'Cursor 10 (420 к.с.)', 'Cursor 13 (500 к.с.)', 'Cursor 13 (560 к.с.)'], image: '🚛', partsCount: 6780 },
          { id: 'eurocargo', name: 'Eurocargo', years: '2015–н.в.', engines: ['Tector 5 (160 к.с.)', 'Tector 5 (190 к.с.)', 'Tector 7 (220 к.с.)', 'Tector 7 (280 к.с.)', 'Tector 7 (320 к.с.)'], image: '🚚', partsCount: 4230, popular: true },
          { id: 'daily-7', name: 'Daily (VII)', years: '2019–н.в.', engines: ['F1A (136 к.с.)', 'F1A (156 к.с.)', 'F1C (170 к.с.)', 'F1C (210 к.с.)'], image: '🚐', partsCount: 3450 },
          { id: 't-way', name: 'T-Way', years: '2019–н.в.', engines: ['Cursor 11 (430 к.с.)', 'Cursor 13 (490 к.с.)', 'Cursor 13 (570 к.с.)'], image: '🚛', partsCount: 2890 },
        ],
      },
      {
        id: 'renault-trucks',
        name: 'Renault Trucks',
        logo: '🇫🇷',
        country: 'Франція',
        models: [
          { id: 't-high', name: 'T High', years: '2013–н.в.', engines: ['DTI 11 (430 к.с.)', 'DTI 11 (460 к.с.)', 'DTI 13 (480 к.с.)', 'DTI 13 (520 к.с.)'], image: '🚛', partsCount: 4230, popular: true },
          { id: 't-range', name: 'T', years: '2013–н.в.', engines: ['DTI 11 (380 к.с.)', 'DTI 11 (430 к.с.)', 'DTI 11 (460 к.с.)', 'DTI 13 (480 к.с.)'], image: '🚛', partsCount: 4560 },
          { id: 'd-range', name: 'D', years: '2013–н.в.', engines: ['DTI 5 (210 к.с.)', 'DTI 5 (240 к.с.)', 'DTI 8 (280 к.с.)', 'DTI 8 (320 к.с.)'], image: '🚚', partsCount: 3890 },
          { id: 'c-range', name: 'C', years: '2013–н.в.', engines: ['DTI 8 (320 к.с.)', 'DTI 11 (380 к.с.)', 'DTI 11 (430 к.с.)', 'DTI 11 (460 к.с.)'], image: '🚛', partsCount: 3340 },
          { id: 'master', name: 'Master', years: '2019–н.в.', engines: ['2.3 dCi (135 к.с.)', '2.3 dCi (150 к.с.)', '2.3 dCi (180 к.с.)'], image: '🚐', partsCount: 2780, popular: true },
        ],
      },
    ],
  },
];

export const partCategoriesForVehicles = {
  passenger: [
    { icon: '🔧', name: 'Двигун', count: 12450 },
    { icon: '🛞', name: 'Гальмівна система', count: 8920 },
    { icon: '🔩', name: 'Підвіска', count: 10340 },
    { icon: '⚡', name: 'Електрика', count: 7650 },
    { icon: '🛢️', name: 'Фільтри', count: 15230 },
    { icon: '⚙️', name: 'Трансмісія', count: 5670 },
    { icon: '❄️', name: 'Охолодження', count: 4890 },
    { icon: '🪟', name: 'Кузовні деталі', count: 6780 },
    { icon: '💨', name: 'Вихлопна система', count: 3450 },
    { icon: '💡', name: 'Оптика', count: 4120 },
  ],
  truck: [
    { icon: '🔧', name: 'Двигун', count: 18950 },
    { icon: '🛞', name: 'Гальмівна система', count: 12340 },
    { icon: '🔩', name: 'Підвіска та ходова', count: 9870 },
    { icon: '⚡', name: 'Електрика', count: 8450 },
    { icon: '🛢️', name: 'Фільтри', count: 14560 },
    { icon: '⚙️', name: 'КПП / Зчеплення', count: 7890 },
    { icon: '💨', name: 'Пневматика', count: 6780 },
    { icon: '🪟', name: 'Кабіна', count: 5670 },
    { icon: '🧊', name: 'Охолодження', count: 5230 },
    { icon: '🚿', name: 'Паливна система', count: 4560 },
  ],
};
