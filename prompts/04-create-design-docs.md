### Tujuan
membuat ui konsisten dalam project


### Color Palette
#### Primary
| Token           | Hex         | Usage                  |
| --------------- | ----------- | ---------------------- |
| Primary 50      | `#EFF6FF`   | Background hover/light |
| Primary 100     | `#DBEAFE`   | Soft background        |
| Primary 200     | `#BFDBFE`   | Border light           |
| Primary 300     | `#93C5FD`   | Disabled state         |
| Primary 400     | `#60A5FA`   | Secondary button       |
| **Primary 500** | **#3B82F6** | **Main Brand Color**   |
| Primary 600     | `#2563EB`   | Button Hover           |
| Primary 700     | `#1D4ED8`   | Active                 |
| Primary 800     | `#1E40AF`   | Strong emphasis        |
| Primary 900     | `#1E3A8A`   | Dark Mode              |

#### Natural
| Token    | Hex       |
| -------- | --------- |
| Gray 50  | `#F9FAFB` |
| Gray 100 | `#F3F4F6` |
| Gray 200 | `#E5E7EB` |
| Gray 300 | `#D1D5DB` |
| Gray 400 | `#9CA3AF` |
| Gray 500 | `#6B7280` |
| Gray 600 | `#4B5563` |
| Gray 700 | `#374151` |
| Gray 800 | `#1F2937` |
| Gray 900 | `#111827` |

#### Semantic Colors
| Token   | Hex       | Usage       |
| ------- | --------- | ----------- |
| Success | `#22C55E` | Success     |
| Warning | `#F59E0B` | Warning     |
| Error   | `#EF4444` | Error       |
| Info    | `#0EA5E9` | Information |

#### Background
| Token      | Hex       |
| ---------- | --------- |
| Background | `#FFFFFF` |
| Surface    | `#F8FAFC` |
| Card       | `#FFFFFF` |
| Sidebar    | `#F9FAFB` |

#### Border
| Token   | Hex       |
| ------- | --------- |
| Default | `#E5E7EB` |
| Focus   | `#3B82F6` |
| Divider | `#F3F4F6` |

### Typography
| Token   | Size | Line Height | Weight   |
| ------- | ---- | ----------- | -------- |
| Display | 32px | 40px        | Bold     |
| H1      | 28px | 36px        | Bold     |
| H2      | 24px | 32px        | Bold     |
| H3      | 20px | 28px        | Semibold |
| H4      | 18px | 26px        | Semibold |
| H5      | 16px | 24px        | Medium   |
| H6      | 14px | 20px        | Medium   |
| Body    | 14px | 20px        | Regular  |
| Small   | 13px | 18px        | Regular  |
| Caption | 12px | 16px        | Regular  |

### Spacing
| Token | Value |
| ----- | ----- |
| xs    | 2px   |
| sm    | 4px   |
| md    | 8px   |
| lg    | 12px  |
| xl    | 16px  |
| 2xl   | 24px  |
| 3xl   | 32px  |

### Border Radius
| Token | Value  |
| ----- | ------ |
| xs    | 2px    |
| sm    | 4px    |
| md    | 6px    |
| lg    | 8px    |
| xl    | 12px   |
| Full  | 9999px |

### Component Height
| Component      | Height |
| -------------- | ------ |
| Button Small   | 28px   |
| Button Default | 32px   |
| Button Large   | 36px   |
| Input          | 32px   |
| Select         | 32px   |
| Badge          | 20px   |
| Tag            | 20px   |
| Switch         | 18px   |
| Checkbox       | 16px   |
| Radio          | 16px   |

### Icon Size
| Token | Size |
| ----- | ---- |
| xs    | 12px |
| sm    | 14px |
| md    | 16px |
| lg    | 20px |
| xl    | 24px |

### Container
| Token          | Value |
| -------------- | ----- |
| Card Padding   | 12px  |
| Modal Padding  | 16px  |
| Drawer Padding | 16px  |
| Form Gap       | 12px  |
| Section Gap    | 20px  |

### Button Padding
| Size    | Padding  |
| ------- | -------- |
| Small   | `0 10px` |
| Default | `0 12px` |
| Large   | `0 16px` |

### Table
| Item          | Value |
| ------------- | ----- |
| Row Height    | 36px  |
| Cell Padding  | 8px   |
| Header Height | 40px  |

### Sidebar
| Item        | Value |
| ----------- | ----- |
| Width       | 220px |
| Collapse    | 72px  |
| Item Height | 36px  |

### Navbar
| Item   | Value |
| ------ | ----- |
| Height | 52px  |

### Device Reference
| Device           | Width       |
| ---------------- | ----------- |
| Mobile           | 320–639px   |
| Tablet Portrait  | 640–767px   |
| Tablet Landscape | 768–1023px  |
| Laptop           | 1024–1279px |
| Desktop          | 1280–1535px |
| Large Desktop    | ≥1536px     |

### Container Width
| Breakpoint | Max Width |
| ---------- | --------- |
| sm         | 640px     |
| md         | 768px     |
| lg         | 1024px    |
| xl         | 1280px    |
| 2xl        | 1536px    |

### Grid System
| Device  | Columns |
| ------- | ------- |
| Mobile  | 4       |
| Tablet  | 8       |
| Desktop | 12      |

### Spacing
| Device  | Padding |
| ------- | ------- |
| Mobile  | 16px    |
| Tablet  | 24px    |
| Desktop | 32px    |

### Responsive Typography
| Token | Mobile | Tablet | Desktop |
| ----- | ------ | ------ | ------- |
| H1    | 32px   | 40px   | 48px    |
| H2    | 28px   | 32px   | 36px    |
| H3    | 24px   | 28px   | 30px    |
| H4    | 20px   | 24px   | 24px    |
| Body  | 14px   | 16px   | 16px    |
| Small | 12px   | 14px   | 14px    |


### Instruction
berdasarkan .opencode/skills/naiveui-practices
sesuaikan dengan naiveui dan inisialiasi design pada ./client menggunakan naiveui
selalu dahulukan penggunaan naiveui daripada tailwindcss (jika memang dibutuhkan baru gunakan tailwindcss)
buatkan docs/design-system.md
update docs/docs/architecture.md
update AGENTS.md

jangan koding dulu hanya jalanakan instruction dan buat file impementasi tasks/03-imp-design-system.md