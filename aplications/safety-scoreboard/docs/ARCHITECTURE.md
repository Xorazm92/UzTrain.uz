# "MM-CONTROL" Tizimi Arxitekturasi

## Tizim Diagrammasi

```mermaid
graph TD
    User((Foydalanuvchi))
    
    subgraph Frontend [Frontend (React + Vite)]
        UI[User Interface]
        Auth[Auth Module]
        MapComp[Map Component (Leaflet)]
        Dashboard[Dashboard & Charts]
    end
    
    subgraph Backend [Backend (Node.js + Express)]
        API[API Gateway]
        AuthService[Auth Service]
        CalcEngine[Calculation Engine]
        DataService[Data Service]
    end
    
    subgraph Database [Database (PostgreSQL + PostGIS)]
        DB[(Primary DB)]
        GeoDB[(Geo Data)]
    end
    
    User <-->|HTTPS| UI
    UI <-->|JSON / REST API| API
    API <--> AuthService
    API <--> CalcEngine
    API <--> DataService
    
    DataService <-->|SQL| DB
    DataService <-->|Spatial Queries| GeoDB
    
    CalcEngine <-->|Read Data| DB
```

## Texnologik Stack

| Komponent | Texnologiya | Sabab |
|---|---|---|
| **Frontend** | React.js (Vite) | Zamonaviy, tez va keng tarqalgan. |
| **UI Library** | Shadcn UI / MUI | Premium dizayn va tayyor komponentlar. |
| **Backend** | Node.js (Express) | JS ekotizimi, Frontend bilan integratsiya oson. |
| **Database** | PostgreSQL | Ishonchli relyatsion baza. |
| **GIS Module** | PostGIS + Leaflet | Geografik ma'lumotlar va xarita uchun standart. |
| **Deploy** | Netlify (Front) + Render/Heroku (Back) | Oson va tezkor deploy. |

## Ma'lumotlar Oqimi (Data Flow)

1. **Ma'lumot Kiritish:** Foydalanuvchi Frontend orqali oy, yil va bo'linma uchun ma'lumotlarni kiritadi -> Backend `/api/data-entry` -> DB `kpi_monthly_data`.
2. **Hisoblash:** Ma'lumot kiritilganda yoki Dashboard so'ralganda, Backend `Calculation Engine` ishga tushadi, DB dan ma'lumotlarni oladi, KPI va Reytingni hisoblaydi.
3. **Ko'rsatish:** Backend tayyor hisoblangan ma'lumotlarni JSON formatida Frontendga uzatadi -> Frontend `Recharts` va `Leaflet` orqali vizualizatsiya qiladi.
