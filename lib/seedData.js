// One-time seed data for the properties table, extracted from the original
// hard-coded SITE_DATA / ADDRESS_LOOKUP constants that used to live in index.html.
//
// This is only ever inserted automatically when the properties table is
// completely empty (see lib/ensureSeeded.js) — it will never overwrite real
// edits made once the table has data in it.
//
// category is one of: 'basis' | 'not_relevant' | 'not_included'
//   - 'basis'        rows power the "Basis Calculation" tab (land/building/accdep)
//   - 'not_relevant' rows power the "Not Relevant" tab (name + optional extra note)
//   - 'not_included' rows power the "Not Included" tab (name only)
// sort_order preserves the original display order within each category.

const SEED_ROWS = [
  {
    "category": "basis",
    "name": "Center - Gander",
    "land": 5055212.79,
    "building": 5383667.28,
    "accdep": 2429652.35,
    "address": "440 Gander Drive, Charlottesville, VA 22903",
    "extra": null,
    "sort_order": 0
  },
  {
    "category": "basis",
    "name": "Center - 1854 E Market St",
    "land": 844415.85,
    "building": 2191961.27,
    "accdep": 1287750.09,
    "address": "1854 E Market St., Harrisonburg, VA 22801",
    "extra": null,
    "sort_order": 1
  },
  {
    "category": "basis",
    "name": "Center - Tire Mart",
    "land": 408821.5,
    "building": 1994508.12,
    "accdep": 1176077.15,
    "address": "1027 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 2
  },
  {
    "category": "basis",
    "name": "Center - Genesis",
    "land": 185812.77,
    "building": 415958.43,
    "accdep": 262418.24,
    "address": "823 Richmond Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 3
  },
  {
    "category": "basis",
    "name": "Center - 2655 S Main St. Hburg",
    "land": 680853.41,
    "building": 752087.03,
    "accdep": 388328.37,
    "address": "2655 S Main St., Harrisonburg, VA 22801",
    "extra": null,
    "sort_order": 4
  },
  {
    "category": "basis",
    "name": "Center - Verona",
    "land": 677177,
    "building": 2365470.32,
    "accdep": 1297098.69,
    "address": "465/485 Lee Hwy, Verona, VA 24482",
    "extra": null,
    "sort_order": 5
  },
  {
    "category": "basis",
    "name": "Center - Heritage building",
    "land": 225791.76,
    "building": 684438.46,
    "accdep": 478304.25,
    "address": "2815-2817 N Augusta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 6
  },
  {
    "category": "basis",
    "name": "Center - Elliott",
    "land": 659524.44,
    "building": 892522.85,
    "accdep": 387794.13,
    "address": "1100 Greenville Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 7
  },
  {
    "category": "basis",
    "name": "Center - Hoy",
    "land": 685714,
    "building": 1200400.4,
    "accdep": 710314.01,
    "address": "729 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 8
  },
  {
    "category": "basis",
    "name": "Center - Sunnyside",
    "land": 319784.41,
    "building": 1809390.77,
    "accdep": 481736.98,
    "address": "105 Lee Jackson Highway, Staunton, VA 24401",
    "extra": null,
    "sort_order": 9
  },
  {
    "category": "basis",
    "name": "Center - Log Lot",
    "land": 416881.3,
    "building": 1320787,
    "accdep": 579720.02,
    "address": "49 Lee Jackson Highway, Staunton, VA 24401",
    "extra": null,
    "sort_order": 10
  },
  {
    "category": "basis",
    "name": "Center - 143/153 Crown Drive",
    "land": 1072251.87,
    "building": 5553564.12,
    "accdep": 1382331.13,
    "address": "Danville, VA 24540",
    "extra": null,
    "sort_order": 11
  },
  {
    "category": "basis",
    "name": "Building - Caliber",
    "land": 84919,
    "building": 1473865.5,
    "accdep": 914555.58,
    "address": "1720 Seminole Trail, Charlottesville, VA 22903",
    "extra": null,
    "sort_order": 12
  },
  {
    "category": "basis",
    "name": "Building - Honda Auto Body shop/Swartz",
    "land": 1349561.54,
    "building": 84325.69,
    "accdep": 23258.93,
    "address": "2675 S Main St., Harrisonburg, VA 22801",
    "extra": null,
    "sort_order": 13
  },
  {
    "category": "basis",
    "name": "Building - F&M Bank",
    "land": null,
    "building": 148452.52,
    "accdep": 118215.76,
    "address": "2813 N Augusta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 14
  },
  {
    "category": "basis",
    "name": "Building - Old Planters LLC",
    "land": 155184.57,
    "building": 386414.59,
    "accdep": 229970.06,
    "address": "115 Lee Jackson Hwy, Staunton, VA 24401",
    "extra": null,
    "sort_order": 15
  },
  {
    "category": "basis",
    "name": "Building - Flow Corner",
    "land": null,
    "building": 20875,
    "accdep": 34634.17,
    "address": "1289 Stoney Point Rd, Charlotesville, VA 22903",
    "extra": null,
    "sort_order": 16
  },
  {
    "category": "basis",
    "name": "Building - Flow Center Lot",
    "land": 3629994.21,
    "building": 1515068.03,
    "accdep": 342598.66,
    "address": "1311 Stoney Point Rd, Charlotesville, VA 22903",
    "extra": null,
    "sort_order": 17
  },
  {
    "category": "basis",
    "name": "FPT - Habitat Warehouse - Building",
    "land": null,
    "building": 2325,
    "accdep": null,
    "address": "434 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 18
  },
  {
    "category": "basis",
    "name": "Building - Wells Property/Bookstore",
    "land": 97369.99,
    "building": 410593.51,
    "accdep": 76871.03,
    "address": "707 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 19
  },
  {
    "category": "basis",
    "name": "Lot - McDonough Toyota ground lease, DDC (2 lots)",
    "land": 166901,
    "building": 13210,
    "accdep": 14622.37,
    "address": "1007, 1009 Richmond Rd, Staunton, VA 24401",
    "extra": null,
    "sort_order": 20
  },
  {
    "category": "basis",
    "name": "Building & Bays - 808 Richmond",
    "land": 70000,
    "building": 408113.69,
    "accdep": 372797.08,
    "address": "808 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 21
  },
  {
    "category": "basis",
    "name": "Building - 802 Richmond (Dahl Invest)",
    "land": 31520.4,
    "building": 46523.82,
    "accdep": 46532.82,
    "address": "802 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 22
  },
  {
    "category": "basis",
    "name": "Building - Log Lot - Old Cash Advance",
    "land": null,
    "building": 125426.45,
    "accdep": 116434.64,
    "address": "61 Lee Jackson Highway, Staunton, VA 24401",
    "extra": null,
    "sort_order": 23
  },
  {
    "category": "basis",
    "name": "Building - Office NDEP",
    "land": 88700,
    "building": 436909.06,
    "accdep": 168163.39,
    "address": "2903 N Augusta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 24
  },
  {
    "category": "basis",
    "name": "House - 337 Lancaster Ave",
    "land": 4920,
    "building": 147994.53,
    "accdep": 88755.08,
    "address": "337 Lancaster Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 25
  },
  {
    "category": "basis",
    "name": "House - 304 Powell St.",
    "land": 4046,
    "building": 50358.69,
    "accdep": 40539.62,
    "address": "304 Powell St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 26
  },
  {
    "category": "basis",
    "name": "House - 76 Young St.",
    "land": null,
    "building": 40196.41,
    "accdep": 22828.99,
    "address": "76 Young St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 27
  },
  {
    "category": "basis",
    "name": "Dahl - Payne House",
    "land": null,
    "building": 158153.54,
    "accdep": 85039.72,
    "address": "42 Payne Lane, Staunton, VA 24401",
    "extra": null,
    "sort_order": 28
  },
  {
    "category": "basis",
    "name": "GAE - Nags Head House",
    "land": null,
    "building": 475563.33,
    "accdep": null,
    "address": "1223 S Va Dare Trail, Kill Devil Hills, NC 27948",
    "extra": null,
    "sort_order": 29
  },
  {
    "category": "basis",
    "name": "GAE - Smith Mountain Lake House",
    "land": null,
    "building": 300144.17,
    "accdep": null,
    "address": "180 Peninsula Pt., Moneta, VA 24121",
    "extra": null,
    "sort_order": 30
  },
  {
    "category": "basis",
    "name": "House - 910 Richmond",
    "land": 152736.19,
    "building": 103492.06,
    "accdep": 30577.27,
    "address": "910 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 31
  },
  {
    "category": "basis",
    "name": "Dahl - Woodlee House (GAE)",
    "land": null,
    "building": 263486.44,
    "accdep": 179089.27,
    "address": "41 Woodlee Rd, Staunton, VA 24401",
    "extra": null,
    "sort_order": 32
  },
  {
    "category": "basis",
    "name": "Lot - next to Hoy Center 1",
    "land": 101496.07,
    "building": null,
    "accdep": null,
    "address": "723 Richmond Ave., Staunton, VA 24401",
    "extra": null,
    "sort_order": 33
  },
  {
    "category": "basis",
    "name": "Lot - Arehart (Part of Pole Lot Development)",
    "land": 398754.65,
    "building": 125884.72,
    "accdep": 44238.11,
    "address": "1211 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 34
  },
  {
    "category": "basis",
    "name": "Lot - next to Hoy Center 2",
    "land": 48373.97,
    "building": null,
    "accdep": null,
    "address": "801 Richmond Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 35
  },
  {
    "category": "basis",
    "name": "Lot - next to Hoy Center 3",
    "land": 824.44,
    "building": null,
    "accdep": null,
    "address": "803 Richmond Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 36
  },
  {
    "category": "basis",
    "name": "Lot - Pole Lot",
    "land": 370894.16,
    "building": null,
    "accdep": null,
    "address": "1213 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 37
  },
  {
    "category": "basis",
    "name": "Lot - Hunter Ave Properties",
    "land": 170410.04,
    "building": null,
    "accdep": null,
    "address": "Hunter Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 38
  },
  {
    "category": "basis",
    "name": "Lot - by Chipotle Center/Longhorn",
    "land": 381783.54,
    "building": null,
    "accdep": null,
    "address": "106 Crossing Way, Staunton, VA 24401",
    "extra": null,
    "sort_order": 39
  },
  {
    "category": "basis",
    "name": "Lot - Staunton Crossing Back",
    "land": 1506063.88,
    "building": null,
    "accdep": null,
    "address": "399 Crossing Way, Staunton, VA 24401",
    "extra": null,
    "sort_order": 40
  },
  {
    "category": "basis",
    "name": "Lot - behind Subaru/Old Ray Car, DDC",
    "land": 9666.03,
    "building": null,
    "accdep": null,
    "address": "Augusta Parcel 055 78, Staunton, VA 24401",
    "extra": null,
    "sort_order": 41
  },
  {
    "category": "basis",
    "name": "Lot - behind Subaru/Old Ray Car, GCS",
    "land": 358731.04,
    "building": null,
    "accdep": null,
    "address": "Augusta Parcel 055 78A, Staunton, VA 24401",
    "extra": null,
    "sort_order": 42
  },
  {
    "category": "basis",
    "name": "Lot - 4.977 acres Windigrove, Waynesboro",
    "land": 1602516.79,
    "building": null,
    "accdep": null,
    "address": "4.977 acres, back lot on Windigrove, Waynesboro, VA 22980",
    "extra": null,
    "sort_order": 43
  },
  {
    "category": "basis",
    "name": "Lot - Windigrove, Waynesboro",
    "land": 5447.58,
    "building": null,
    "accdep": null,
    "address": "0 Windigrove Dr., Waynesboro, VA 22980",
    "extra": null,
    "sort_order": 44
  },
  {
    "category": "basis",
    "name": "Lot - 3 Acres off of Statler Blvd/Hunter Ave",
    "land": 232264.1,
    "building": null,
    "accdep": null,
    "address": "Statler Blvd/Hunter Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 45
  },
  {
    "category": "basis",
    "name": "Lot - next to Thomas's Staunton house",
    "land": 32703.63,
    "building": null,
    "accdep": null,
    "address": "10 Trace Dr., Staunton, VA 24401",
    "extra": null,
    "sort_order": 46
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 1",
    "land": 590783.29,
    "building": null,
    "accdep": null,
    "address": "1001 Alta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 47
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 2",
    "land": 2131.2,
    "building": null,
    "accdep": null,
    "address": "1005 Alta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 48
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 3",
    "land": 2131.2,
    "building": null,
    "accdep": null,
    "address": "1007 Alta St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 49
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 6",
    "land": 62.19,
    "building": null,
    "accdep": null,
    "address": "115 Bell St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 50
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 7",
    "land": 41239.6,
    "building": null,
    "accdep": 10464.28,
    "address": "1002 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 51
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 8",
    "land": 37313.48,
    "building": null,
    "accdep": null,
    "address": "1004 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 52
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 9",
    "land": 44424.6,
    "building": null,
    "accdep": null,
    "address": "1006 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 53
  },
  {
    "category": "basis",
    "name": "Lot - Eiland, Partial 10",
    "land": 28087.15,
    "building": null,
    "accdep": null,
    "address": "1008 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 54
  },
  {
    "category": "basis",
    "name": "Lot - next to Outback 1",
    "land": 444494.88,
    "building": null,
    "accdep": null,
    "address": "24 Windigrove, Waynesboro, VA 22980",
    "extra": null,
    "sort_order": 55
  },
  {
    "category": "basis",
    "name": "Lot - next to Outback 2",
    "land": 19591.32,
    "building": null,
    "accdep": null,
    "address": "36 Windigrove, Waynesboro, VA 22980",
    "extra": null,
    "sort_order": 56
  },
  {
    "category": "basis",
    "name": "Lot - Storage Lot O'baugh Ford - Augusta Lot 1",
    "land": 10841.47,
    "building": null,
    "accdep": null,
    "address": "11 Orchard Hill Square, Staunton, VA 24401",
    "extra": null,
    "sort_order": 57
  },
  {
    "category": "basis",
    "name": "Lot - behind O'baugh Ford - 2 Staunton Lots",
    "land": 367097.85,
    "building": null,
    "accdep": null,
    "address": "337 & 337A Old Greenville Rd, Staunton, VA 24401",
    "extra": null,
    "sort_order": 58
  },
  {
    "category": "basis",
    "name": "Lot - behind Hoy Center",
    "land": 312,
    "building": null,
    "accdep": null,
    "address": "880 Jones St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 59
  },
  {
    "category": "basis",
    "name": "Lot - behind Hoy Center- Crawford lot",
    "land": 960.54,
    "building": null,
    "accdep": null,
    "address": "886 Jones St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 60
  },
  {
    "category": "basis",
    "name": "Lot - behind Bills TV 1",
    "land": 151155.5,
    "building": null,
    "accdep": null,
    "address": "702 De Jarnette Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 61
  },
  {
    "category": "basis",
    "name": "Lot - behind Bills TV 2",
    "land": 191.16,
    "building": null,
    "accdep": null,
    "address": "668 Statler Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 62
  },
  {
    "category": "basis",
    "name": "Lot - behind Bills TV 3",
    "land": 630,
    "building": null,
    "accdep": null,
    "address": "670 Statler Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 63
  },
  {
    "category": "basis",
    "name": "Lot - 801 Hunter Ave",
    "land": 942.68,
    "building": null,
    "accdep": null,
    "address": "801 Hunter Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 64
  },
  {
    "category": "basis",
    "name": "Lot - behind 808 Richmond Building 2",
    "land": 177.74,
    "building": null,
    "accdep": null,
    "address": "802 Hunter Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 65
  },
  {
    "category": "basis",
    "name": "Lot - 804 Hunter behind 808 Richmond",
    "land": 477742.57,
    "building": null,
    "accdep": null,
    "address": "804 Hunter Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 66
  },
  {
    "category": "basis",
    "name": "Lot - behind 808 Richmond Building 1",
    "land": 63.1,
    "building": null,
    "accdep": null,
    "address": "730 De Jarnette Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 67
  },
  {
    "category": "basis",
    "name": "Lot - 904 Richmond",
    "land": 43119.38,
    "building": null,
    "accdep": null,
    "address": "904 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 68
  },
  {
    "category": "basis",
    "name": "Lot - 906 Richmond",
    "land": 32778.06,
    "building": null,
    "accdep": null,
    "address": "906 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 69
  },
  {
    "category": "basis",
    "name": "Lot - 914 Richmond",
    "land": 422.24,
    "building": null,
    "accdep": null,
    "address": "914 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 70
  },
  {
    "category": "basis",
    "name": "Lot - next to McDonough Toyota Used",
    "land": 77391.76,
    "building": null,
    "accdep": null,
    "address": "818 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 71
  },
  {
    "category": "basis",
    "name": "Lot - Powell St.",
    "land": 35149.6,
    "building": null,
    "accdep": null,
    "address": "302 Powell St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 72
  },
  {
    "category": "not_relevant",
    "name": "Center - 210 N Central Ave / 211 N Lewis St",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "Staunton, VA 24401",
    "extra": null,
    "sort_order": 0
  },
  {
    "category": "not_relevant",
    "name": "Center - 213 N Lewis St",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "Staunton, VA 24401",
    "extra": null,
    "sort_order": 1
  },
  {
    "category": "not_relevant",
    "name": "House - 72 Young St.",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "72 Young St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 2
  },
  {
    "category": "not_relevant",
    "name": "Building - 110 W Beverly St.",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "110 W Beverly St., Staunton, VA 24401",
    "extra": null,
    "sort_order": 3
  },
  {
    "category": "not_relevant",
    "name": "FPT - Habitat Warehouse - Garage/Harner",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "480 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 4
  },
  {
    "category": "not_relevant",
    "name": "Dahl - Woodlee Barn",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "41 A Woodlee Rd, Staunton, VA 24401",
    "extra": null,
    "sort_order": 5
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind Goodwill-Staunton",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "312 Mary Gray Ln, Staunton, VA 24401",
    "extra": null,
    "sort_order": 6
  },
  {
    "category": "not_relevant",
    "name": "Center - Genesis Parking Lot",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "825 Richmond Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 7
  },
  {
    "category": "not_relevant",
    "name": "Center - 1854 E Market Lot in Back",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "22 Terri Drive, Harrisonburg, VA 22801",
    "extra": null,
    "sort_order": 8
  },
  {
    "category": "not_relevant",
    "name": "Building - Flow Back Lot",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "1321 Stoney Point Rd, Charlotesville, VA 22903",
    "extra": null,
    "sort_order": 9
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind Starbucks Woodstock - 2 Lots",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "1025 Woodstock Commons Drive, Woodstock, VA 22664",
    "extra": null,
    "sort_order": 10
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind Genesis 1",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "204 National Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 11
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind Genesis 2",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "208 National Ave, Stuanton, VA 24401",
    "extra": null,
    "sort_order": 12
  },
  {
    "category": "not_relevant",
    "name": "Lot - Eiland, Partial 11",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "1012 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 13
  },
  {
    "category": "not_relevant",
    "name": "FPT - Habitat Warehouse - Lot",
    "land": null,
    "building": null,
    "accdep": null,
    "address": "450 Richmond Ave, Staunton, VA 24401",
    "extra": null,
    "sort_order": 14
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind Old Ray Carr, HD Rev Trust Landlocked (Augusta Parcel 055 80)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 15
  },
  {
    "category": "not_relevant",
    "name": "Lot - behind O'baugh Ford - Augusta Lot 2 (Old Greenville Rd. Parcel 055 80G)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 16
  },
  {
    "category": "not_relevant",
    "name": "Lot - Eiland, Partial 4 (1009 Alta St.)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 17
  },
  {
    "category": "not_relevant",
    "name": "Lot - Eiland, Partial 5 (1011 Alta St.)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 18
  },
  {
    "category": "not_relevant",
    "name": "Dahl - Conservation Easement - Track 2 (793 Statler Blvd)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": "conservation easement, owning party \"Dahl\" (family, not a specific LLC)",
    "sort_order": 19
  },
  {
    "category": "not_relevant",
    "name": "Dahl - Conservation Easement - Track 1 (806 Hunter Ave)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": "conservation easement, same note",
    "sort_order": 20
  },
  {
    "category": "not_included",
    "name": "Building - Tita Sales (61 Lee Jackson Hwy)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 0
  },
  {
    "category": "not_included",
    "name": "Building - 713 N Augusta St (FPT LLC, vacant)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 1
  },
  {
    "category": "not_included",
    "name": "Land - 2110 Seminole Trail (Dulaney) (TAP)",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 2
  },
  {
    "category": "not_included",
    "name": "Land - 0 India Rd./Hillsdale Drive (Charlottesville) - Vacant land",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 3
  },
  {
    "category": "not_included",
    "name": "Land - 1936 Medical Avenue (Harrisonburg) - Vacant land",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 4
  },
  {
    "category": "not_included",
    "name": "Land - 1935 Deyerle Avenue (Harrisonburg) - Vacant land",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 5
  },
  {
    "category": "not_included",
    "name": "Land - Windigrove Country Club Lot (Waynesboro) - Vacant land",
    "land": null,
    "building": null,
    "accdep": null,
    "address": null,
    "extra": null,
    "sort_order": 6
  }
];

module.exports = { SEED_ROWS };
