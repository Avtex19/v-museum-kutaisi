export type Lang = "en" | "ka";

export function localizeEra(era: string | null | undefined, lang: Lang): string {
  if (!era || lang === "en") return era ?? "";
  return era
    .replace(/\bBCE\b/g, "ძვ. წ.")
    .replace(/\bCE\b/g, "ახ. წ.");
}

export const translations = {
  en: {
    // site
    virtualMuseum: "Virtual Museum",
    siteTitle: "V-Museum Kutaisi",
    siteDesc:
      "Step inside thematic rooms and explore Kutaisi's heritage — 360° artifact views, hand-crafted annotations, and audio guides.",
    // home
    chooseRoom: "Choose a room",
    roomsOpen: (n: number) => `${n} ${n === 1 ? "room" : "rooms"} open`,
    addRoom: "+ Add Room",
    logout: "Logout",
    adminLogin: "Admin Login",
    noRoomsYet: "No rooms yet.",
    noRoomsSeed: "Run",
    noRoomsSeedCmd: "python manage.py seed_rooms",
    noRoomsSeedAfter: "to set up thematic rooms.",
    // room card
    artifactCount: (n: number) => `${n} ${n === 1 ? "artifact" : "artifacts"}`,
    enter: "Enter →",
    exhibition: "Exhibition",
    // room page
    backAllRooms: "All rooms",
    aboutThisRoom: "About this room",
    audioGuide: "Audio guide",
    artifactsInRoom: "Artifacts in this room",
    itemCount: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
    addArtifact: "+ Add Artifact",
    noArtifactsFilters: "No artifacts match your filters.",
    // artifact card
    noImage: "No image",
    // artifacts list page
    catalogue: "Catalogue",
    allArtifacts: "All artifacts",
    objectCount: (n: number) => `${n} ${n === 1 ? "object" : "objects"}`,
    matchFilters: "match your filters",
    noArtifactsMatch:
      "No artifacts match these filters. Try widening the search.",
    // filters
    searchPlaceholder: "Search by name, culture, material…",
    category: "Category",
    period: "Period",
    room: "Room",
    sort: "Sort",
    sortNameAZ: "Name A→Z",
    sortNameZA: "Name Z→A",
    sortNewest: "Newest",
    sortMostViewed: "Most viewed",
    apply: "Apply",
    // artifact detail
    aboutThisObject: "About this object",
    viewMore: "View more",
    viewLess: "View less",
    backTo: "Back to",
  },
  ka: {
    // site
    virtualMuseum: "ვირტუალური მუზეუმი",
    siteTitle: "ვ-მუზეუმი ქუთაისი",
    siteDesc:
      "შედი სათემატო დარბაზებში და გაეცანი ქუთაისის მემკვიდრეობას — 360° ხედები, ხელნაკეთი ანოტაციები და აუდიო გიდები.",
    // home
    chooseRoom: "აირჩიე დარბაზი",
    roomsOpen: (n: number) => `${n} ${n === 1 ? "დარბაზი" : "დარბაზი"} ღია`,
    addRoom: "+ დარბაზის დამატება",
    logout: "გამოსვლა",
    adminLogin: "ადმინი",
    noRoomsYet: "დარბაზები ჯერ არ არის.",
    noRoomsSeed: "გაუშვი",
    noRoomsSeedCmd: "python manage.py seed_rooms",
    noRoomsSeedAfter: "სათემატო დარბაზების შესაქმნელად.",
    // room card
    artifactCount: (n: number) => `${n} არტეფაქტი`,
    enter: "შესვლა →",
    exhibition: "გამოფენა",
    // room page
    backAllRooms: "ყველა დარბაზი",
    aboutThisRoom: "ამ დარბაზის შესახებ",
    audioGuide: "აუდიო გიდი",
    artifactsInRoom: "ამ დარბაზის არტეფაქტები",
    itemCount: (n: number) => `${n} ექსპონატი`,
    addArtifact: "+ არტეფაქტის დამატება",
    noArtifactsFilters: "ფილტრს არტეფაქტები არ შეესაბამება.",
    // artifact card
    noImage: "სურათი არ არის",
    // artifacts list page
    catalogue: "კატალოგი",
    allArtifacts: "ყველა არტეფაქტი",
    objectCount: (n: number) => `${n} ობიექტი`,
    matchFilters: "შეესაბამება ფილტრებს",
    noArtifactsMatch:
      "ამ ფილტრებს არტეფაქტები არ შეესაბამება. სცადე ძებნის გაფართოება.",
    // filters
    searchPlaceholder: "ძებნა სახელით, კულტურით, მასალით…",
    category: "კატეგორია",
    period: "პერიოდი",
    room: "დარბაზი",
    sort: "სორტირება",
    sortNameAZ: "სახელი A→Z",
    sortNameZA: "სახელი Z→A",
    sortNewest: "უახლესი",
    sortMostViewed: "ყველაზე ნანახი",
    apply: "გამოყენება",
    // artifact detail
    aboutThisObject: "ობიექტის შესახებ",
    viewMore: "მეტის ნახვა",
    viewLess: "ნაკლების ნახვა",
    backTo: "უკან —",
  },
} as const;
