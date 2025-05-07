export const map0 = [
  {
    "id": "N1",
    "type": "underground",
    "connections": [
      "N2",
      "N13",
      "N12"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N2",
    "type": "forest",
    "connections": [
      "N1",
      "N3",
      "N12"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N3",
    "type": "underground",
    "connections": [
      "N2",
      "N4",
      "N10"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N4",
    "type": "underground",
    "connections": [
      "N3",
      "N5",
      "N12",
      "N8"
    ],
    "extractionZone": true,
    "spawn": false,
    "level": 7,
    "soldiers": []
  },
  {
    "id": "N5",
    "type": "urban",
    "connections": [
      "N4",
      "N6"
    ],
    "extractionZone": false,
    "spawn": true,
    "level": 1,
    "soldiers": []
  },
  {
    "id": "N6",
    "type": "industrial",
    "connections": [
      "N5",
      "N7"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 1,
    "soldiers": []
  },
  {
    "id": "N7",
    "type": "forest",
    "connections": [
      "N6",
      "N8"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 1,
    "soldiers": []
  },
  {
    "id": "N8",
    "type": "urban",
    "connections": [
      "N7",
      "N9",
      "N11",
      "N4"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 7,
    "soldiers": []
  },
  {
    "id": "N9",
    "type": "forest",
    "connections": [
      "N8",
      "N10",
      "N11"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N10",
    "type": "industrial",
    "connections": [
      "N9",
      "N11",
      "N3",
      "N14"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 7,
    "soldiers": []
  },
  {
    "id": "N11",
    "type": "urban",
    "connections": [
      "N10",
      "N12",
      "N16",
      "N9",
      "N8"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 10,
    "soldiers": []
  },
  {
    "id": "N12",
    "type": "urban",
    "connections": [
      "N11",
      "N13",
      "N2",
      "N4",
      "N1"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 10,
    "soldiers": []
  },
  {
    "id": "N13",
    "type": "urban",
    "connections": [
      "N12",
      "N14",
      "N1"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N14",
    "type": "industrial",
    "connections": [
      "N13",
      "N15",
      "N10"
    ],
    "extractionZone": true,
    "spawn": false,
    "level": 4,
    "soldiers": []
  },
  {
    "id": "N15",
    "type": "industrial",
    "connections": [
      "N14",
      "N16"
    ],
    "extractionZone": false,
    "spawn": true,
    "level": 1,
    "soldiers": []
  },
  {
    "id": "N16",
    "type": "forest",
    "connections": [
      "N15",
      "N11"
    ],
    "extractionZone": false,
    "spawn": false,
    "level": 1,
    "soldiers": []
  }
];