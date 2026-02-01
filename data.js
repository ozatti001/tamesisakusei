// StageLink sample data (no real company names)
export const SUPPORTS = [
  {
    "key": "pc",
    "label": "配信用PC支給"
  },
  {
    "key": "gear",
    "label": "機材サポート"
  },
  {
    "key": "studio",
    "label": "スタジオ利用"
  },
  {
    "key": "tech",
    "label": "技術サポート"
  },
  {
    "key": "manager",
    "label": "マネージャー担当"
  },
  {
    "key": "debut",
    "label": "デビュー支援"
  }
];
export const STUDIOS = [
  {
    "id": "sample-a",
    "name": "サンプル事務所A",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-a",
    "recruitUrl": "https://example.com/studio-a/recruit",
    "supports": {
      "pc": "yes",
      "gear": "unknown",
      "studio": "yes",
      "tech": "yes",
      "manager": "unknown",
      "debut": "yes"
    },
    "summary": "活動環境の整備に力を入れている事務所（サンプル）。",
    "lastChecked": "2026-02-01"
  },
  {
    "id": "sample-b",
    "name": "サンプル事務所B",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-b",
    "recruitUrl": "https://example.com/studio-b/recruit",
    "supports": {
      "pc": "unknown",
      "gear": "yes",
      "studio": "no",
      "tech": "yes",
      "manager": "yes",
      "debut": "unknown"
    },
    "summary": "マネージャー体制と技術面の支援が明記されている（サンプル）。",
    "lastChecked": "2026-02-01"
  },
  {
    "id": "sample-c",
    "name": "サンプル事務所C",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-c",
    "recruitUrl": "https://example.com/studio-c/recruit",
    "supports": {
      "pc": "no",
      "gear": "unknown",
      "studio": "unknown",
      "tech": "no",
      "manager": "yes",
      "debut": "yes"
    },
    "summary": "サポートは一部のみ明記、他は不明として扱う（サンプル）。",
    "lastChecked": "2026-02-01"
  },
  {
    "id": "sample-d",
    "name": "サンプル事務所D",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-d",
    "recruitUrl": "https://example.com/studio-d/recruit",
    "supports": {
      "pc": "yes",
      "gear": "yes",
      "studio": "unknown",
      "tech": "unknown",
      "manager": "no",
      "debut": "no"
    },
    "summary": "機材・PC支給は明記、担当体制は要確認（サンプル）。",
    "lastChecked": "2026-02-01"
  },
  {
    "id": "sample-e",
    "name": "サンプル事務所E",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-e",
    "recruitUrl": "https://example.com/studio-e/recruit",
    "supports": {
      "pc": "unknown",
      "gear": "no",
      "studio": "yes",
      "tech": "unknown",
      "manager": "unknown",
      "debut": "yes"
    },
    "summary": "スタジオ利用・デビュー支援は明記（サンプル）。",
    "lastChecked": "2026-02-01"
  },
  {
    "id": "sample-f",
    "name": "サンプル事務所F",
    "status": "所属タレント募集中",
    "officialUrl": "https://example.com/studio-f",
    "recruitUrl": "https://example.com/studio-f/recruit",
    "supports": {
      "pc": "no",
      "gear": "no",
      "studio": "no",
      "tech": "unknown",
      "manager": "unknown",
      "debut": "unknown"
    },
    "summary": "記載が少ない場合は“不明”を基本にする（サンプル）。",
    "lastChecked": "2026-02-01"
  }
];
