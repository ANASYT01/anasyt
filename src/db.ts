/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoItem, Order, BrandingSettings, SectionTitle, WhitelistItem, Reward, PromoCode, PendingApproval, ReviewItem, UserProfile, getCleanAuthor } from './types';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const clientDb = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

const CLOUD_MEDIA_MAP: Record<string, string> = {
  'f05a58c4-9485-403a-bc28-ebc611ad726f.jpg': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2Ff05a58c4-9485-403a-bc28-ebc611ad726f.jpg?alt=media&token=290b9338-3a98-4d37-ba9d-96b706ba2074',
  '899b5f2e-80eb-4e2c-9653-1bc80bb03cf2.MP4_secure_compat.mp4': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F899b5f2e-80eb-4e2c-9653-1bc80bb03cf2.MP4_secure_compat.mp4?alt=media&token=fd809aec-daca-48a7-a748-9a298b96adc3',
  '6806dd6a-0637-4447-acde-1814819d5b4b.jpg': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F6806dd6a-0637-4447-acde-1814819d5b4b.jpg?alt=media&token=6b355deb-0751-419c-8ceb-147b5117fc3b',
  '79ae8a35-de21-492e-a7fa-6f8f5a38a0a9.MP4_secure_compat.mp4': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F79ae8a35-de21-492e-a7fa-6f8f5a38a0a9.MP4_secure_compat.mp4?alt=media&token=4776317b-930e-4cbc-b131-e4ca0208bffa',
  '34ceb359-c57c-40b8-a83a-e83bc4679baf.jpg': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F34ceb359-c57c-40b8-a83a-e83bc4679baf.jpg?alt=media&token=6205c81b-80b7-476c-ab86-ba8db9e74ff1',
  'f51676d8-c308-47ad-af8d-919e16126a6c.MP4_secure_compat.mp4': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2Ff51676d8-c308-47ad-af8d-919e16126a6c.MP4_secure_compat.mp4?alt=media&token=6a05f51e-9e47-4fe7-805f-e7ca78f5640f',
  '2859d0e5-6fc9-4de5-a437-91b420d557bc.jpg': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F2859d0e5-6fc9-4de5-a437-91b420d557bc.jpg?alt=media&token=d3b9917c-2486-4c5c-8780-a108dbdf7aee',
  'e7dbfbd5-2ac4-47e8-8d55-3011c15281e1.MP4_secure_compat.mp4': 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2Fe7dbfbd5-2ac4-47e8-8d55-3011c15281e1.MP4_secure_compat.mp4?alt=media&token=6ccd3807-e17d-49f4-a94e-4c6d91ecdd03'
};

function toCloudMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const filename = url.split('/').pop() || '';
  if (CLOUD_MEDIA_MAP[filename]) return CLOUD_MEDIA_MAP[filename];
  return url;
}

// Converts a Blob/File to a Base64 data URL for persistence
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// SECURE IN-MEMORY / SESSION ADMIN PASSWORD TOKEN
let adminPasswordToken: string = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('omerta_admin_token') || '') : '';

// Always clean up lingering legacy tokens in localStorage
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('omerta_admin_token');
  localStorage.removeItem('north47_admin_token');
}

export function setAdminPasswordToken(password: string) {
  adminPasswordToken = password;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('omerta_admin_token', password);
  }
}

export function getAdminPasswordToken() {
  return adminPasswordToken;
}

export function clearAdminPasswordToken() {
  adminPasswordToken = '';
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('omerta_admin_token');
  }
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      setAdminPasswordToken(password);
      return true;
    }
    return false;
  } catch (err) {
    console.error('[AUTH DB] Error validating passcode with server:', err);
    return false;
  }
}

export function getAuthHeaders(additional: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...additional };
  const token = getAdminPasswordToken();
  if (token) {
    headers['X-Admin-Password'] = token;
  }
  const tg = (window as any).Telegram?.WebApp;
  if (tg && tg.initData && tg.initData.trim() !== '') {
    headers['X-Telegram-Init-Data'] = tg.initData.trim();
  }
  return headers;
}

export function getAdminHeaders(additional: Record<string, string> = {}): Record<string, string> {
  return getAuthHeaders(additional);
}

export const KNOWN_DELETED_PRODUCT_IDS = new Set<string>([
  'omerta-custom-1787518977330', // ALIEN CHERRY LEMON (STATIC)
  'omerta-custom-1789329871783', // FORBIDEN FRUIT CAKE (STATIC)
  'omerta-custom-1789425992320', // TROPICAL TANGIE (STATIC)
]);

export const DEFAULT_PRODUCTS: VideoItem[] = [
  {
    id: 'omerta-custom-1789426483100',
    title: 'GMO X RUNTZ🍰🍓',
    description: '• Notes de burger grillé, d’ail et de gaz, avec une finition crémeuse et épicée. 🍔⛽🔥',
    category: 'FROZEN',
    city: 'casablanca',
    cities: ['casablanca', 'rabat', 'marrakech', 'tanger', 'agadir', 'fes'],
    pricing: {
      '5g': 25,
      '10g': 50,
      '25g': 125,
      '50g': 200,
      '100g': 350,
      '500g': 1500,
      '1kg': 2500
    },
    price: 5,
    pricePerGram: 5,
    thumbnailUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2F2859d0e5-6fc9-4de5-a437-91b420d557bc.jpg?alt=media&token=d3b9917c-2486-4c5c-8780-a108dbdf7aee',
    videoUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0292552802.firebasestorage.app/o/uploads%2Fe7dbfbd5-2ac4-47e8-8d55-3011c15281e1.MP4_secure_compat.mp4?alt=media&token=6ccd3807-e17d-49f4-a94e-4c6d91ecdd03',
    imageUrl: '',
    additionalPhotos: [],
    duration: '0:15',
    views: 624,
    isPremium: true,
    isFeatured: true,
    badge: 'IN_STOCK',
    author: 'FRESH GENETICS 💎',
    currency: 'EUR'
  }
];

export function getLocalDeletedProductIds(): Set<string> {
  const set = new Set<string>(KNOWN_DELETED_PRODUCT_IDS);
  try {
    const raw = localStorage.getItem('hashman_deleted_products_v1');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach((id: any) => set.add(String(id)));
    }
    const raw2 = localStorage.getItem('omerta_deleted_ids');
    if (raw2) {
      const arr2 = JSON.parse(raw2);
      if (Array.isArray(arr2)) arr2.forEach((id: any) => set.add(String(id)));
    }
  } catch (_) {}
  return set;
}

export function recordLocalDeletedProductId(id: string): void {
  if (!id) return;
  try {
    const set = getLocalDeletedProductIds();
    set.add(String(id));
    const list = Array.from(set);
    localStorage.setItem('hashman_deleted_products_v1', JSON.stringify(list));
    localStorage.setItem('omerta_deleted_ids', JSON.stringify(list));
  } catch (_) {}
}

function filterForbiddenProducts(list: VideoItem[]): VideoItem[] {
  if (!Array.isArray(list)) return [];
  const deletedIds = getLocalDeletedProductIds();
  return list
    .filter((p) => {
      if (!p || !p.id || deletedIds.has(String(p.id))) return false;
      const cat = (p.category || '').toLowerCase();
      const zone = (p.displayZone || '').toLowerCase();
      if (
        cat.includes('rabat') ||
        cat.includes('meet up') ||
        cat.includes('accessoire') ||
        zone.includes('rabat') ||
        zone.includes('meet up') ||
        zone.includes('accessoire')
      ) {
        return false;
      }
      return true;
    })
    .map((p) => ({
      ...p,
      videoUrl: toCloudMediaUrl(p.videoUrl),
      thumbnailUrl: toCloudMediaUrl(p.thumbnailUrl),
      imageUrl: toCloudMediaUrl(p.imageUrl),
      city: p.city ? String(p.city).toLowerCase() : undefined,
      cities: Array.isArray(p.cities) && p.cities.length > 0
        ? p.cities.map((c: any) => String(c).toLowerCase())
        : (p.city ? [String(p.city).toLowerCase()] : undefined),
      author: getCleanAuthor(p.author),
      title: (p.title || '').replace(/shelf(\s*terps)?|farm(\s*of\s*friends)?|greenfarmez|elanasser|laanassar|anassar|biscotti(\s*boys)?|tricom(e|\s*labz)?|lost\s*in\s*(the\s*)?rif|house\s*of\s*rif(\s*farmz)?|the\s*hashman(\s*shop)?|hashman/gi, 'FRESH GENETICS 💎'),
      description: (p.description || '').replace(/shelf(\s*terps)?|farm(\s*of\s*friends)?|greenfarmez|elanasser|laanassar|anassar|biscotti(\s*boys)?|tricom(e|\s*labz)?|lost\s*in\s*(the\s*)?rif|house\s*of\s*rif(\s*farmz)?|the\s*hashman(\s*shop)?|hashman/gi, 'FRESH GENETICS 💎'),
      currency: 'EUR'
    }));
}

// 1. PRODUCTS CENTRAL API
export async function getProducts(): Promise<VideoItem[]> {
  try {
    const res = await fetch(`/api/products?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAuthHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      throw new Error('Failed to retrieve products from server');
    }
    const list = await res.json();
    if (Array.isArray(list)) {
      const formatted = filterForbiddenProducts(
        list.map((p: any) => ({
          ...p,
          currency: 'EUR'
        }))
      );
      
      // Save to local cache for instant zero-latency loading
      try {
        localStorage.setItem('north47_cached_products_v3', JSON.stringify(formatted));
        localStorage.setItem('omerta_fallback_products', JSON.stringify(formatted));
      } catch (e) {
        console.warn('LocalStorage cache write error:', e);
      }

      return formatted;
    }
  } catch (err) {
    console.warn('Backend server unreachable, querying Firebase Firestore directly:', err);
  }

  // Direct Firebase Firestore fallback (critical for Vercel / GitHub static deployments)
  try {
    const snap = await getDocs(collection(clientDb, 'products'));
    if (!snap.empty) {
      const fbList = snap.docs.map((d) => ({ ...d.data(), id: d.id } as VideoItem));
      const formatted = filterForbiddenProducts(fbList);
      try {
        localStorage.setItem('north47_cached_products_v3', JSON.stringify(formatted));
        localStorage.setItem('omerta_fallback_products', JSON.stringify(formatted));
      } catch (e) {}
      return formatted;
    }
  } catch (fbErr) {
    console.warn('Direct Firestore query error, checking localStorage fallback:', fbErr);
  }

  // If server and Firestore are unreachable, try to load from client localStorage
  const local = localStorage.getItem('north47_cached_products_v3') || localStorage.getItem('omerta_fallback_products');
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return filterForbiddenProducts(parsed);
      }
    } catch (e) {}
  }

  // Guaranteed fallback baseline products (filtered through deleted blacklist)
  return filterForbiddenProducts(DEFAULT_PRODUCTS);
}

export async function addProduct(product: VideoItem, videoBlob?: Blob, photoBlob?: Blob): Promise<void> {
  const payload = { ...product };

  // If a file was uploaded as raw blob, upload it to Server to store as static asset
  if (videoBlob) {
    try {
      const b64 = await blobToBase64(videoBlob);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ filename: 'video.mp4', base64: b64 })
      });
      if (res.ok) {
        const d = await res.json();
        payload.videoUrl = d.url;
      }
    } catch (e) {
      console.error('Core video upload error:', e);
    }
  } else if (payload.videoUrl && payload.videoUrl.startsWith('data:')) {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ filename: 'video.mp4', base64: payload.videoUrl })
      });
      if (res.ok) {
        const d = await res.json();
        payload.videoUrl = d.url;
      }
    } catch (e) {
      console.error('Base64 video upload error:', e);
    }
  }

  if (photoBlob) {
    try {
      const b64 = await blobToBase64(photoBlob);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ filename: 'image.jpg', base64: b64 })
      });
      if (res.ok) {
        const d = await res.json();
        payload.thumbnailUrl = d.url;
      }
    } catch (e) {
      console.error('Core photo upload error:', e);
    }
  } else if (payload.thumbnailUrl && payload.thumbnailUrl.startsWith('data:')) {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ filename: 'image.jpg', base64: payload.thumbnailUrl })
      });
      if (res.ok) {
        const d = await res.json();
        payload.thumbnailUrl = d.url;
      }
    } catch (e) {
      console.error('Base64 photo upload error:', e);
    }
  }

  // Also upload any base64 additional photos
  if (payload.additionalPhotos && payload.additionalPhotos.length > 0) {
    const uploadedPhotos: string[] = [];
    for (const photo of payload.additionalPhotos) {
      if (photo && photo.startsWith('data:')) {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ filename: 'additional.jpg', base64: photo })
          });
          if (res.ok) {
            const d = await res.json();
            uploadedPhotos.push(d.url);
          } else {
            uploadedPhotos.push(photo);
          }
        } catch (e) {
          console.error('Base64 additional photo upload error:', e);
          uploadedPhotos.push(photo);
        }
      } else {
        uploadedPhotos.push(photo);
      }
    }
    payload.additionalPhotos = uploadedPhotos;
  }

  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      throw new Error('Server API unavailable, saving directly to Firestore');
    }
  } catch (apiErr) {
    // Direct Firestore write when running on static host (Vercel / GitHub)
    await setDoc(doc(clientDb, 'products', payload.id), payload);
  }

  // Sync client-side fallback list
  try {
    const updatedList = await getProducts();
    localStorage.setItem('omerta_fallback_products', JSON.stringify(updatedList));
  } catch (e) {}
}

export async function deleteProduct(id: string): Promise<void> {
  recordLocalDeletedProductId(id);

  // 1. Immediately purge from local storage caches
  try {
    const c1 = localStorage.getItem('north47_cached_products_v3');
    if (c1) {
      const p1 = JSON.parse(c1).filter((p: any) => p.id !== id);
      localStorage.setItem('north47_cached_products_v3', JSON.stringify(p1));
    }
    const c2 = localStorage.getItem('omerta_fallback_products');
    if (c2) {
      const p2 = JSON.parse(c2).filter((p: any) => p.id !== id);
      localStorage.setItem('omerta_fallback_products', JSON.stringify(p2));
    }
  } catch (_) {}

  // 2. Delete from Server API
  try {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
  } catch (apiErr) {
    console.warn('Server API delete product error:', apiErr);
  }

  // 3. Delete from Firestore directly
  try {
    await deleteDoc(doc(clientDb, 'products', id));
  } catch (fbErr) {
    console.warn('Direct Firestore delete product error:', fbErr);
  }
}

// Left as an empty pass-through helper for backward compatibility, because all URL resolutions are pre-computed on upload
export function resolveMediaUrls(product: any): VideoItem {
  return product as VideoItem;
}

// 2. ORDERS JOURNAL API
export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`/api/orders?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAdminHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) throw new Error('Failed to retrieve orders');
    return await res.json();
  } catch (err) {
    console.warn('Backend server orders query unreachable, using local fallback:', err);
    const local = localStorage.getItem('omerta_fallback_orders');
    return local ? JSON.parse(local) : [];
  }
}

export async function createOrder(order: Order): Promise<void> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(order)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Impossible d\'enregistrer la réservation.');
  }

  // Also write to local storage as fallback
  try {
    const localList = await getOrders();
    localStorage.setItem('omerta_fallback_orders', JSON.stringify(localList));
  } catch (e) {}
}

export async function updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error('Failed to update order status');
  }

  try {
    const localList = await getOrders();
    localStorage.setItem('omerta_fallback_orders', JSON.stringify(localList));
  } catch (e) {}
}

export async function deleteOrder(orderId: string): Promise<void> {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });

  if (!res.ok) {
    throw new Error('Failed to purge order');
  }

  try {
    const localList = await getOrders();
    localStorage.setItem('omerta_fallback_orders', JSON.stringify(localList));
  } catch (e) {}
}

export async function getBrandingSettings(): Promise<BrandingSettings> {
  const defaultTitles: SectionTitle[] = [
    { id: '1', text: 'MAES INTERNATIONAL', category: 'All', size: 'L', color: '#D4AF37', enabled: true, order: 1 },
    { id: '2', text: 'SELECTION DRY', category: 'DRY', size: 'L', color: '#D4AF37', enabled: true, order: 2 },
    { id: '3', text: 'SELECTION FROZEN', category: 'FROZEN', size: 'L', color: '#D4AF37', enabled: true, order: 3 },
    { id: '4', text: 'SELECTION STATIC', category: 'STATIC', size: 'L', color: '#D4AF37', enabled: true, order: 4 }
  ];

  const defaultSettings: BrandingSettings = {
    promoMessageText: "🚨 NEW DROP EST DISPONIBLE 🚨\n\nLes nouvelles références sont arrivées. 👀🔥\n\n📲 La mini-application est opérationnelle pour passer vos commandes.\nAppuyez sur 🛒 Shop pour y accéder directement.\n\n⚠️ Si vous n’avez pas encore accès, envoyez votre ID en privé afin d’être ajouté à la liste d’accès.\n@yoru47\n\nBonne découverte à tous. 💨",
    promoButtonText: 'Boutique 🛍️',
    introBgUrl: '/the_hashman_shop_welcome.jpg',
    launchScreenUrl: '/the_hashman_shop_welcome.jpg',
    homepageHeroBgUrl: '/the_hashman_shop_welcome.jpg',
    bgLogoUrl: '/the_hashman_shop_welcome.jpg',
    logoUrl: '/the_hashman_shop_welcome.jpg',
    promoImageUrl: '/assets/aistudio/6008268280986013487_09131328.jpg',
    introStatusLine: 'FRESH GENETICS 💎 — BOUTIQUE OFFICIELLE',
    telegramChannelUrl: 'https://t.me/yoru47',
    telegramSupportUrl: 'https://t.me/yoru47',
    signalUrl: 'https://signal.me/#eu/w6NQMTq58RhypsehbArfwBE8e6-MEK-eVR00xyjQk5HJmVv06d9BVLnw6fW-poXa',
    customAppUrl: 'https://the-hasman.vercel.app',
    sectionTitles: defaultTitles
  };



  try {
    const res = await fetch(`/api/settings?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAdminHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      throw new Error('Failed to fetch settings');
    }
    const data = await res.json();
    if (!data.sectionTitles) {
      data.sectionTitles = defaultTitles;
    }
    try {
      localStorage.setItem('north47_cached_settings', JSON.stringify(data));
    } catch (e) {}
    return data;
  } catch (e) {
    console.warn('Server settings unreachable, querying Firebase Firestore directly:', e);
  }

  try {
    const snap = await getDoc(doc(clientDb, 'settings', 'branding'));
    if (snap.exists()) {
      const fbData = { ...defaultSettings, ...snap.data() } as BrandingSettings;
      if (!fbData.sectionTitles) fbData.sectionTitles = defaultTitles;
      try {
        localStorage.setItem('north47_cached_settings', JSON.stringify(fbData));
      } catch (e) {}
      return fbData;
    }
  } catch (fbErr) {
    console.warn('Direct Firestore settings query error:', fbErr);
  }

  const cached = localStorage.getItem('north47_cached_settings');
  if (cached) {
    try {
      return { ...defaultSettings, ...JSON.parse(cached) };
    } catch (err) {}
  }
  return defaultSettings;
}

export async function updateBrandingSettings(settings: Partial<BrandingSettings>): Promise<BrandingSettings> {
  const payload = { ...settings };
  const keys: (keyof BrandingSettings)[] = ['introBgUrl', 'launchScreenUrl', 'homepageHeroBgUrl', 'logoUrl', 'introVideoUrl', 'bgLogoUrl', 'promoImageUrl'];

  for (const key of keys) {
    const val = payload[key];
    if (typeof val === 'string' && val.startsWith('data:')) {
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ filename: `${key}.jpg`, base64: val })
        });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          (payload as any)[key] = data.url;
        }
      } catch (e) {
        console.error(`Error uploading branding ${key}:`, e);
      }
    }
  }

  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update brand visuals');
  const d = await res.json();
  return d.settings;
}

export async function uploadFileRawFallback(
  file: File,
  onProgress?: (
    index: number,
    total: number,
    step?: 'upload' | 'verify' | 'store' | 'done' | 'error',
    extra?: { logs?: string[]; error?: string; httpStatus?: number; httpResponse?: string; message?: string }
  ) => void
): Promise<string> {
  // Try raw binary uploading first: it avoids massive base64 string overhead in memory, protecting mobile webviews and preventing crashes/timeouts
  try {
    if (onProgress) {
      onProgress(1, 1, 'upload', {
        logs: [`[CANAL SECOUR] Expédition directe ordonnée. Envoi d'un monobloc binaire brut...`]
      });
    }
    const res = await fetch('/api/upload-raw', {
      method: 'POST',
      headers: getAdminHeaders({
        'Content-Type': 'application/octet-stream',
        'x-filename': encodeURIComponent(file.name)
      }),
      body: file
    });
    if (res.ok) {
      const data = await res.json();
      if (onProgress) {
        onProgress(1, 1, 'done', {
          message: data.message || 'Fichier préservé par le canal de secours binaire.',
          logs: [`[SUCCÈS PIXEL] Mouvement du média complété avec brio.`]
        });
      }
      return data.url;
    }
    const errText = await res.text();
    console.warn('Raw binary upload failed, trying base64 fallback...', errText);
  } catch (err: any) {
    console.warn('Raw binary upload exception, trying base64 fallback...', err);
  }

  // Base64 fallback for browsers that do not support streaming request bodies fully
  try {
    if (onProgress) {
      onProgress(1, 1, 'upload', {
        logs: [`[CANAL SECOUR] Passage en conversion Base64 sécurisée pour contournement...`]
      });
    }
    const b64 = await blobToBase64(file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ filename: file.name, base64: b64 })
    });
    if (res.ok) {
      const data = await res.json();
      if (onProgress) {
        onProgress(1, 1, 'done', {
          message: data.message || 'Média écrit via flux d\'encodage Base64 de contournement.',
          logs: [`[SUCCÈS BASE64] Fichier finalisé avec succès sur l'hôte.`]
        });
      }
      return data.url;
    }
    const errText = await res.text();
    throw new Error(`Fallback upload failed: ${errText}`);
  } catch (err: any) {
    if (onProgress) {
      onProgress(1, 1, 'error', {
        error: err.message || String(err),
        logs: [`[ERREUR FINALE] Téléversement impossible y compris via les canaux de repli : ${err.message || String(err)}`]
      });
    }
    throw new Error(`Upload failed: ${err.message || err}`);
  }
}

export async function uploadFileRaw(
  file: File,
  onProgress?: (
    index: number,
    total: number,
    step?: 'upload' | 'verify' | 'store' | 'done' | 'error',
    extra?: { logs?: string[]; error?: string; httpStatus?: number; httpResponse?: string; message?: string }
  ) => void
): Promise<string> {
  // Split files into chunks of 400KB to completely bypass all cloud ingress load-balancer body limit restrictions (GFE/Nginx 413)
  const uploadId = 'up-' + Math.random().toString(36).slice(2, 11) + '-' + Date.now();
  const CHUNK_SIZE = 400 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE) || 1;

  console.log(`[CHUNKED UPLOAD] Initializing upload for: ${file.name} (Size: ${file.size} bytes). Slicing into ${totalChunks} parts.`);

  try {
    let finalUrl = '';
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, (i + 1) * CHUNK_SIZE);
      const chunk = file.slice(start, end);

      const isLastChunk = i === totalChunks - 1;

      if (isLastChunk && onProgress) {
        onProgress(totalChunks, totalChunks, 'verify', {
          logs: [`[TÉLÉVERSEMENT] Toutes les parties binaires émises. Finalisation de l'assemblage et début de l'analyse codec...`]
        });
      }

      // Start active background status polling during the final chunk request
      let donePolling = false;
      let pollInterval: any = null;
      if (isLastChunk) {
        pollInterval = setInterval(async () => {
          if (donePolling) {
            clearInterval(pollInterval);
            return;
          }
          try {
            const sRes = await fetch(`/api/upload-status/${uploadId}`, {
              headers: getAdminHeaders()
            });
            if (sRes.ok && !donePolling) {
              const sData = await sRes.json();
              if (sData.step === 'done' || sData.step === 'error') {
                donePolling = true;
                clearInterval(pollInterval);
              }
              if (onProgress) {
                onProgress(totalChunks, totalChunks, sData.step, {
                  logs: sData.logs || [],
                  error: sData.error
                });
              }
            }
          } catch (e) {
            // silent catch for transient fetch errors during reboot/restart
          }
        }, 800);
      }

      let res;
      try {
        res = await fetch('/api/upload-chunk', {
          method: 'POST',
          headers: getAdminHeaders({
            'Content-Type': 'application/octet-stream',
            'x-upload-id': uploadId,
            'x-chunk-index': String(i),
            'x-total-chunks': String(totalChunks),
            'x-filename': encodeURIComponent(file.name)
          }),
          body: chunk
        });
      } catch (err: any) {
        donePolling = true;
        if (pollInterval) clearInterval(pollInterval);
        throw err;
      }

      if (!res.ok) {
        const errText = await res.text();
        if (onProgress) {
          onProgress(i + 1, totalChunks, 'error', {
            error: errText || `HTTP ${res.status}`,
            httpStatus: res.status,
            httpResponse: errText,
            logs: [`[ERREUR] Le serveur a rejeté le tronçon de fichier avec statut ${res.status}.`, `Réponse brute : ${errText}`]
          });
        }
        throw new Error(`Failed to transmit chunk ${i + 1}/${totalChunks}: [HTTP ${res.status}] ${errText}`);
      }

      const data = await res.json();
      if (data.fullyUploaded && data.url) {
        finalUrl = data.url;
        donePolling = true;
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      }

      if (onProgress) {
        if (isLastChunk) {
          onProgress(totalChunks, totalChunks, 'done', {
            message: data.message || 'Média écrit et propagé sur le stockage cloud permanent avec succès.',
            logs: [`[TERMINE] Succès ! Média enregistré localement et archivé.`]
          });
        } else {
          onProgress(i + 1, totalChunks, 'upload', {
            logs: [`[TÉLÉVERSEMENT] Partie ${i + 1}/${totalChunks} envoyée mûrement au serveur...`]
          });
        }
      }
    }

    if (finalUrl) {
      console.log(`[CHUNKED UPLOAD] Completed successfully. File preserved back-end at: ${finalUrl}`);
      return finalUrl;
    }
    throw new Error('All chunks uploaded but server omitted target resource URL address.');
  } catch (err: any) {
    console.warn('[CHUNKED UPLOAD] Exception occurred. Invoking absolute fallback handlers...', err);
    if (onProgress) {
      onProgress(totalChunks, totalChunks, 'error', {
        error: err.message || String(err),
        logs: [
          `[FALLBACK] Exception détectée dans le flux de fragments : ${err.message || String(err)}`,
          `[FALLBACK] Déclenchement du repli vers l'uploader monobloc sécurisé...`
        ]
      });
    }
    return await uploadFileRawFallback(file, onProgress);
  }
}

// 5. WHITELIST MANAGEMENT API
export async function getWhitelist(): Promise<WhitelistItem[]> {
  try {
    const res = await fetch(`/api/access-control?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAdminHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) throw new Error('Failed to fetch whitelist from server');
    return await res.json();
  } catch (err) {
    console.warn('Backend server access-control query unreachable:', err);
    return [];
  }
}

export async function addWhitelistItem(item: Omit<WhitelistItem, 'id'> & { id?: string }): Promise<WhitelistItem> {
  const res = await fetch('/api/access-control', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    throw new Error('Failed to add whitelist item to server');
  }
  const data = await res.json();
  return data.entry;
}

export async function deleteWhitelistItem(id: string): Promise<void> {
  const res = await fetch(`/api/access-control/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to delete whitelist item from server');
  }
}

// 5.1 PENDING APPROVALS MANAGEMENT CLIENT API
export async function getPendingApprovals(): Promise<PendingApproval[]> {
  try {
    const res = await fetch('/api/pending-approvals', {
      headers: getAdminHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch pending approvals');
    return await res.json();
  } catch (err) {
    console.warn('Backend pending-approvals query unreachable:', err);
    return [];
  }
}

export async function approvePendingRequest(id: string, telegramId: string, username: string, notes?: string): Promise<any> {
  const res = await fetch('/api/pending-approvals/approve', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, telegramId, username, notes })
  });
  if (!res.ok) {
    throw new Error('Failed to approve pending request');
  }
  return await res.json();
}

export async function rejectPendingRequest(id: string, telegramId: string): Promise<any> {
  const res = await fetch('/api/pending-approvals/reject', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id, telegramId })
  });
  if (!res.ok) {
    throw new Error('Failed to reject pending request');
  }
  return await res.json();
}

export async function verifyAccess(userId: string, username: string, device: string, initData?: string, firstName?: string, lastName?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-access', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ userId, username, device, initData, firstName, lastName })
    });
    if (!res.ok) throw new Error('Check returned non-ok status');
    const data = await res.json();
    return !!data.whitelisted;
  } catch (err) {
    console.warn('Fallback: Access verification check unreachable, default to true:', err);
    return true; // fail-safe if offline
  }
}

export async function getConnectionLogs(): Promise<any[]> {
  try {
    const res = await fetch(`/api/connection-logs?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAdminHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) throw new Error('Failed to fetch connection logs from server');
    return await res.json();
  } catch (err) {
    console.warn('Backend server connection logs unreachable:', err);
    return [];
  }
}

export async function deleteConnectionLog(id: string): Promise<void> {
  const res = await fetch(`/api/connection-logs/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to delete connection log from server');
  }
}

export async function triggerTelegramBroadcast(options?: { forceAll?: boolean }): Promise<any> {
  const res = await fetch('/api/telegram-broadcast', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(options || {})
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to trigger broadcast');
  }
  return await res.json();
}

export async function resetTelegramBroadcastStatus(): Promise<any> {
  const res = await fetch('/api/telegram-broadcast-reset', {
    method: 'POST',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to reset broadcast status');
  }
  return await res.json();
}

export async function undoLastTelegramBroadcast(): Promise<any> {
  const res = await fetch('/api/telegram-broadcast-delete-last', {
    method: 'POST',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to undo last broadcast');
  }
  return await res.json();
}

export async function editLastTelegramBroadcast(): Promise<any> {
  const res = await fetch('/api/telegram-broadcast-edit-last', {
    method: 'POST',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to edit last broadcast');
  }
  return await res.json();
}

export async function deleteTelegramMessageManual(chatId: string, messageId: string|number): Promise<any> {
  const res = await fetch('/api/telegram-message-delete-manual', {
    method: 'POST',
    headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId: String(chatId).trim(), messageId })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete message manually');
  }
  return await res.json();
}

export async function editTelegramMessageManual(chatId: string, messageId: string|number, text: string, url: string, buttonLabel?: string, hasPhoto?: boolean, url2?: string, buttonLabel2?: string): Promise<any> {
  const res = await fetch('/api/telegram-message-edit-manual', {
    method: 'POST',
    headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chatId: String(chatId).trim(),
      messageId,
      text,
      url,
      buttonLabel,
      hasPhoto,
      url2,
      buttonLabel2
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to edit message manually');
  }
  return await res.json();
}

export async function getTelegramBroadcastStatus(): Promise<any> {
  const res = await fetch('/api/telegram-broadcast-status', {
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to fetch telegram broadcast status');
  }
  return await res.json();
}

// 8. MEMBERSHIP & VIP PLATFORM API
export async function getUserProfile(telegramId: string): Promise<any> {
  if (!telegramId || typeof telegramId !== 'string') return null;
  try {
    const res = await fetch(`/api/user-profile/${encodeURIComponent(telegramId.trim())}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to retrieve member profile:', err);
    return null;
  }
}

export async function saveUserProfile(telegramId: string, profile: any): Promise<any> {
  if (!telegramId || typeof telegramId !== 'string') return { success: false };
  try {
    const res = await fetch(`/api/user-profile/${encodeURIComponent(telegramId.trim())}`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(profile)
    });
    if (!res.ok) {
      return { success: false };
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to update member profile:', err);
    return { success: false };
  }
}

export async function getAllUsersProfile(): Promise<any[]> {
  try {
    const res = await fetch(`/api/all-users?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAdminHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch elite members list:', err);
    return [];
  }
}

export async function getUserOrders(telegramId: string): Promise<Order[]> {
  if (!telegramId || typeof telegramId !== 'string') return [];
  try {
    const res = await fetch(`/api/my-orders/${encodeURIComponent(telegramId.trim())}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (err) {
    console.warn('Failed to retrieve personal order history:', err);
    return [];
  }
}

// ==========================================
// CLIENT-SIDE LOYALTY REWARDS SERVICE
// ==========================================
export async function getRewards(): Promise<Reward[]> {
  try {
    const res = await fetch('/api/rewards', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to retrieve active rewards');
    return await res.json();
  } catch (err) {
    console.warn('Backend server rewards unreachable, returning empty list:', err);
    return [];
  }
}

export async function saveReward(reward: Reward): Promise<Reward> {
  const res = await fetch('/api/rewards', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(reward)
  });
  if (!res.ok) {
    throw new Error('Failed to persist reward to database');
  }
  const data = await res.json();
  return data.reward;
}

export async function deleteReward(id: string): Promise<void> {
  const res = await fetch(`/api/rewards/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to purge reward from database');
  }
}

// ==========================================
// CLIENT-SIDE PROMO CODES SERVICE
// ==========================================
export async function getPromoCodes(): Promise<PromoCode[]> {
  const res = await fetch('/api/promo-codes', {
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to retrieve promo codes list');
  }
  return await res.json();
}

export async function savePromoCode(promo: PromoCode): Promise<PromoCode> {
  const res = await fetch('/api/promo-codes', {
    method: 'POST',
    headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(promo)
  });
  if (!res.ok) {
    throw new Error('Failed to persist promo code to database');
  }
  const data = await res.json();
  return data.promoCode;
}

export async function deletePromoCode(id: string): Promise<void> {
  const res = await fetch(`/api/promo-codes/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders()
  });
  if (!res.ok) {
    throw new Error('Failed to purge promo code');
  }
}

export async function validatePromoCode(code: string, cartTotal: number, telegramId?: string): Promise<{
  valid: boolean;
  code?: string;
  type?: 'fixed' | 'percent';
  value?: number;
  discountAmount?: number;
  error?: string;
}> {
  const res = await fetch('/api/promo-codes/validate', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ code, cartTotal, telegramId })
  });
  if (!res.ok) {
    return { valid: false, error: 'Serveur de validation inaccessible' };
  }
  return await res.json();
}

// 9. REVIEWS & USER PROFILE API
export async function getReviews(): Promise<ReviewItem[]> {
  try {
    const res = await fetch(`/api/reviews?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAuthHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Error fetching reviews from server:', err);
    return [];
  }
}

export async function submitReview(payload: {
  telegramId?: string;
  telegramUsername?: string;
  authorName?: string;
  rating: number;
  comment: string;
  category?: string;
}): Promise<{ success: boolean; review?: ReviewItem; error?: string }> {
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Impossible de publier l\'avis' };
    }
    return { success: true, review: data.review };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur réseau lors de l\'envoi de l\'avis' };
  }
}

export async function getMyOrders(telegramId: string): Promise<Order[]> {
  try {
    const res = await fetch(`/api/my-orders/${encodeURIComponent(telegramId)}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: getAuthHeaders({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      })
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Error fetching user orders:', err);
    return [];
  }
}


