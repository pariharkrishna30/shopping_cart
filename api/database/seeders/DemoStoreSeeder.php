<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoStoreSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@eshopping.test'],
            [
                'name' => 'Store Admin',
                'phone' => '+1 555-101-3000',
                'role' => 'admin',
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@eshopping.test'],
            [
                'name' => 'Demo Customer',
                'phone' => '+1 555-101-4000',
                'role' => 'user',
                'password' => Hash::make('password'),
            ]
        );

        $categoryBlueprints = [
            [
                'name' => 'Lifestyle Tech',
                'description' => 'Connected gear for expressive desks, music corners, and modern routines.',
                'image' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'LT',
                'products' => [
                    ['name' => 'Orbit Headphones', 'short' => 'Adaptive noise-cancelling wireless headphones.', 'price' => [179, 319]],
                    ['name' => 'Flux Keyboard', 'short' => 'Machined keyboard with hot-swappable switches.', 'price' => [89, 219]],
                    ['name' => 'Nova Speaker', 'short' => 'Room-filling smart speaker for playlists and calls.', 'price' => [99, 249]],
                    ['name' => 'Signal Webcam', 'short' => '4K creator webcam with low-light enhancement.', 'price' => [79, 189]],
                    ['name' => 'Vector Charger', 'short' => 'Multi-device charger with braided cable set.', 'price' => [39, 99]],
                    ['name' => 'Halo Mouse', 'short' => 'Precision mouse shaped for long creative sessions.', 'price' => [49, 139]],
                    ['name' => 'Tangent Dock', 'short' => 'Aluminum USB-C dock for dual-display desk setups.', 'price' => [89, 229]],
                    ['name' => 'Echo Earbuds', 'short' => 'Compact earbuds with transparent listening mode.', 'price' => [69, 199]],
                    ['name' => 'Atlas Stand', 'short' => 'Adjustable laptop stand with cable management.', 'price' => [45, 119]],
                    ['name' => 'Pulse Light Bar', 'short' => 'Monitor light bar with ambient back glow.', 'price' => [55, 149]],
                    ['name' => 'Frame Mic', 'short' => 'USB microphone for streaming and podcasting.', 'price' => [85, 219]],
                    ['name' => 'Prism Tablet', 'short' => 'Portable tablet for sketching and note capture.', 'price' => [149, 349]],
                    ['name' => 'Drift SSD', 'short' => 'Pocket SSD for fast media backups.', 'price' => [69, 189]],
                    ['name' => 'Beacon Router', 'short' => 'Mesh-ready Wi-Fi router with minimal footprint.', 'price' => [119, 299]],
                    ['name' => 'Lumen Projector', 'short' => 'Compact projector for movie nights and pitch decks.', 'price' => [199, 449]],
                    ['name' => 'Air Mat', 'short' => 'Desk mat with charging zone and soft-touch finish.', 'price' => [39, 109]],
                    ['name' => 'Quartz Watch', 'short' => 'Smart hybrid watch with health tracking.', 'price' => [129, 299]],
                    ['name' => 'Pilot Controller', 'short' => 'Creator control pad with tactile macro keys.', 'price' => [99, 239]],
                    ['name' => 'Focus Lamp', 'short' => 'Task lamp with tuned daylight temperature.', 'price' => [59, 159]],
                    ['name' => 'Comet Monitor', 'short' => 'Ultra-wide display tuned for productivity.', 'price' => [249, 599]],
                ],
            ],
            [
                'name' => 'Active Wear',
                'description' => 'Performance layers and essentials shaped for motion, recovery, and travel.',
                'image' => 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'AW',
                'products' => [
                    ['name' => 'Terrain Jacket', 'short' => 'Weather-ready running shell with reflective details.', 'price' => [69, 179]],
                    ['name' => 'Stride Shorts', 'short' => 'Training shorts with breathable stretch panels.', 'price' => [35, 85]],
                    ['name' => 'Core Leggings', 'short' => 'High-rise leggings with compression knit zones.', 'price' => [49, 119]],
                    ['name' => 'Aero Hoodie', 'short' => 'Lightweight warm-up layer with thumb loops.', 'price' => [55, 139]],
                    ['name' => 'Lift Tee', 'short' => 'Sweat-wicking shirt cut for gym sessions.', 'price' => [25, 69]],
                    ['name' => 'Motion Socks', 'short' => 'Cushioned socks designed for distance days.', 'price' => [12, 28]],
                    ['name' => 'Pivot Bra', 'short' => 'Medium-support bra for studio and cardio.', 'price' => [35, 89]],
                    ['name' => 'Sprint Cap', 'short' => 'Fast-drying cap with laser-cut ventilation.', 'price' => [18, 45]],
                    ['name' => 'Recovery Slides', 'short' => 'Soft foam slides for post-training comfort.', 'price' => [25, 69]],
                    ['name' => 'Nomad Duffel', 'short' => 'Gym-to-weekend bag with wet gear sleeve.', 'price' => [59, 159]],
                    ['name' => 'Trail Vest', 'short' => 'Hydration-ready vest with snug pocket layout.', 'price' => [85, 189]],
                    ['name' => 'Balance Joggers', 'short' => 'Tapered joggers with smooth brushed interior.', 'price' => [49, 119]],
                    ['name' => 'Climb Tank', 'short' => 'Open-back tank for studio and warm weather.', 'price' => [22, 55]],
                    ['name' => 'Atlas Trainer', 'short' => 'Cross-training shoe for lifts and intervals.', 'price' => [79, 179]],
                    ['name' => 'Recover Bottle', 'short' => 'Insulated stainless bottle with carry strap.', 'price' => [24, 58]],
                    ['name' => 'Summit Pack', 'short' => 'Daypack for commute, gym, and short hikes.', 'price' => [49, 129]],
                    ['name' => 'Velocity Windbreaker', 'short' => 'Packable shell with vented back panel.', 'price' => [69, 169]],
                    ['name' => 'Circuit Gloves', 'short' => 'Grip gloves for lifting and conditioning.', 'price' => [18, 42]],
                    ['name' => 'Run Belt', 'short' => 'Bounce-free belt for phone and key storage.', 'price' => [16, 39]],
                    ['name' => 'Flex Towel', 'short' => 'Microfiber towel that dries between sessions fast.', 'price' => [14, 34]],
                ],
            ],
            [
                'name' => 'Home Studio',
                'description' => 'Creator gear for audio, lighting, streaming, and small-space production.',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'HS',
                'products' => [
                    ['name' => 'Pulse Microphone', 'short' => 'Cardioid USB microphone with direct monitoring.', 'price' => [89, 239]],
                    ['name' => 'Scene Light', 'short' => 'Bi-color panel light for desk-side shoots.', 'price' => [79, 199]],
                    ['name' => 'Wave Interface', 'short' => 'Compact audio interface for recording vocals.', 'price' => [99, 229]],
                    ['name' => 'Frame Tripod', 'short' => 'Flexible tripod for camera or phone shooting.', 'price' => [35, 95]],
                    ['name' => 'Studio Boom Arm', 'short' => 'Low-profile boom arm with hidden cable channel.', 'price' => [49, 129]],
                    ['name' => 'Echo Monitors', 'short' => 'Nearfield speakers tuned for balanced mixing.', 'price' => [159, 399]],
                    ['name' => 'Backdrop Kit', 'short' => 'Portable backdrop kit for calls and content.', 'price' => [69, 189]],
                    ['name' => 'Color Control Pad', 'short' => 'Scene controller for lights and camera presets.', 'price' => [85, 219]],
                    ['name' => 'Capture Card', 'short' => 'Low-latency HDMI capture for streaming setups.', 'price' => [69, 189]],
                    ['name' => 'Voice Filter', 'short' => 'Pop filter with quick-lock magnetic mount.', 'price' => [19, 45]],
                    ['name' => 'Sound Tiles', 'short' => 'Acoustic panels for tighter home recording.', 'price' => [39, 109]],
                    ['name' => 'Clip Monitor', 'short' => 'Portable confidence monitor for camera rigs.', 'price' => [129, 279]],
                    ['name' => 'Edit Keyboard', 'short' => 'Shortcut keyboard for editing workflows.', 'price' => [99, 199]],
                    ['name' => 'Studio Chair', 'short' => 'Supportive chair designed for long production blocks.', 'price' => [149, 349]],
                    ['name' => 'Focus Webcam Pro', 'short' => 'Creator camera with manual exposure controls.', 'price' => [129, 329]],
                    ['name' => 'Mix Desk Rack', 'short' => 'Desktop rack shelf for interfaces and control gear.', 'price' => [89, 199]],
                    ['name' => 'Softbox Pair', 'short' => 'Fold-flat softboxes for soft interview lighting.', 'price' => [79, 189]],
                    ['name' => 'Green Screen Fold', 'short' => 'Collapsible background for streaming scenes.', 'price' => [65, 149]],
                    ['name' => 'Cable Vault', 'short' => 'Studio cable organizer and label kit.', 'price' => [24, 59]],
                    ['name' => 'Podcast Mixer', 'short' => 'Desk mixer with pads, ducking, and voice presets.', 'price' => [179, 429]],
                ],
            ],
            [
                'name' => 'Urban Living',
                'description' => 'Textiles, scent, and small home objects with a refined city-apartment feel.',
                'image' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'UL',
                'products' => [
                    ['name' => 'Moss Throw', 'short' => 'Soft woven throw with oversized fringe edge.', 'price' => [39, 119]],
                    ['name' => 'Cinder Lamp', 'short' => 'Sculptural table lamp with warm ambient glow.', 'price' => [69, 189]],
                    ['name' => 'Oak Shelf', 'short' => 'Floating shelf for books, plants, and keepsakes.', 'price' => [49, 129]],
                    ['name' => 'Ceramic Set', 'short' => 'Stackable stoneware mugs with matte glaze.', 'price' => [32, 84]],
                    ['name' => 'Studio Rug', 'short' => 'Textured area rug built for compact living rooms.', 'price' => [119, 329]],
                    ['name' => 'Drift Candle', 'short' => 'Soy candle with cedar, tea, and citrus notes.', 'price' => [18, 44]],
                    ['name' => 'Linen Duvet', 'short' => 'Breathable washed-linen duvet cover set.', 'price' => [95, 249]],
                    ['name' => 'Halo Mirror', 'short' => 'Round mirror with slim metal frame.', 'price' => [79, 219]],
                    ['name' => 'Frame Basket', 'short' => 'Storage basket with leather carry handles.', 'price' => [29, 72]],
                    ['name' => 'Arc Vase', 'short' => 'Tall ceramic vase with hand-finished texture.', 'price' => [28, 88]],
                    ['name' => 'Stone Tray', 'short' => 'Entryway tray for keys, cards, and jewelry.', 'price' => [22, 59]],
                    ['name' => 'City Clock', 'short' => 'Minimal wall clock for kitchens and studios.', 'price' => [35, 99]],
                    ['name' => 'Nook Chair', 'short' => 'Compact lounge chair with curved silhouette.', 'price' => [149, 389]],
                    ['name' => 'Planter Stand', 'short' => 'Elevated plant stand for indoor corners.', 'price' => [34, 89]],
                    ['name' => 'Tactile Towels', 'short' => 'Heavyweight towel set with soft rib texture.', 'price' => [49, 129]],
                    ['name' => 'Monograph Frames', 'short' => 'Gallery frame set for prints and photographs.', 'price' => [39, 109]],
                    ['name' => 'Quiet Diffuser', 'short' => 'Ceramic diffuser with a barely-there hum.', 'price' => [45, 119]],
                    ['name' => 'Balance Stool', 'short' => 'Accent stool that doubles as a side table.', 'price' => [59, 149]],
                    ['name' => 'Contour Bedding', 'short' => 'Crisp bedding set with tonal stitched detail.', 'price' => [89, 229]],
                    ['name' => 'Night Shelf', 'short' => 'Compact bedside shelf for smaller rooms.', 'price' => [42, 112]],
                ],
            ],
            [
                'name' => 'Travel Essentials',
                'description' => 'Practical carry gear and polished accessories for fast-moving itineraries.',
                'image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'TE',
                'products' => [
                    ['name' => 'Atlas Carry-On', 'short' => 'Hard-shell carry-on with quiet spinner wheels.', 'price' => [149, 389]],
                    ['name' => 'Voyage Pouch', 'short' => 'Organizer pouch for cables, pens, and docs.', 'price' => [24, 69]],
                    ['name' => 'Transit Backpack', 'short' => 'Travel backpack with laptop sleeve and side access.', 'price' => [79, 229]],
                    ['name' => 'Passport Wallet', 'short' => 'Slim wallet for passport, cards, and boarding pass.', 'price' => [29, 79]],
                    ['name' => 'Jet Bottle', 'short' => 'Leak-proof bottle sized for personal item pockets.', 'price' => [22, 58]],
                    ['name' => 'Cloud Neck Pillow', 'short' => 'Memory foam neck pillow for long-haul comfort.', 'price' => [25, 69]],
                    ['name' => 'Signal Adapter', 'short' => 'Universal adapter with fast charging ports.', 'price' => [35, 95]],
                    ['name' => 'Roam Sling', 'short' => 'Compact sling for flights, trains, and day walks.', 'price' => [39, 109]],
                    ['name' => 'Map Journal', 'short' => 'Travel journal with paper map inserts.', 'price' => [18, 45]],
                    ['name' => 'Field Blanket', 'short' => 'Packable blanket for layovers and road trips.', 'price' => [32, 85]],
                    ['name' => 'Track Tags', 'short' => 'Luggage tags with privacy flap and metal loop.', 'price' => [12, 34]],
                    ['name' => 'Night Mask', 'short' => 'Contoured sleep mask with cooling fabric.', 'price' => [16, 42]],
                    ['name' => 'Tripod Bottle Kit', 'short' => 'Refillable bottle set for toiletries.', 'price' => [14, 32]],
                    ['name' => 'Port Hoodie', 'short' => 'Travel hoodie with hidden zip pocket.', 'price' => [59, 149]],
                    ['name' => 'Crossbody Case', 'short' => 'Crossbody travel case for city breaks.', 'price' => [39, 104]],
                    ['name' => 'Compass Power Bank', 'short' => 'Fast-charging battery with airline-safe capacity.', 'price' => [45, 129]],
                    ['name' => 'Window Seat Scarf', 'short' => 'Oversized scarf for cool cabins and evenings.', 'price' => [29, 79]],
                    ['name' => 'Rail Packing Cubes', 'short' => 'Compression packing cubes for organized carry.', 'price' => [24, 64]],
                    ['name' => 'Summit Bottle Filter', 'short' => 'Filtered water bottle for remote travel.', 'price' => [49, 119]],
                    ['name' => 'Remote Tracker', 'short' => 'Bag tracker that syncs with your phone.', 'price' => [28, 79]],
                ],
            ],
            [
                'name' => 'Wellness Lab',
                'description' => 'Recovery, mindfulness, and daily ritual products with a calm modern aesthetic.',
                'image' => 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
                'prefix' => 'WL',
                'products' => [
                    ['name' => 'Restore Roller', 'short' => 'Textured recovery roller for legs and back.', 'price' => [25, 69]],
                    ['name' => 'Mind Journal', 'short' => 'Guided journaling book for reflective routines.', 'price' => [18, 49]],
                    ['name' => 'Calm Tea Kit', 'short' => 'Loose-leaf tea trio for evening wind-down.', 'price' => [22, 56]],
                    ['name' => 'Breath Lamp', 'short' => 'Ambient lamp that pulses through breathing cycles.', 'price' => [59, 159]],
                    ['name' => 'Thermal Wrap', 'short' => 'Heated wrap for neck and shoulder recovery.', 'price' => [49, 129]],
                    ['name' => 'Flex Bands', 'short' => 'Resistance band set with travel pouch.', 'price' => [19, 45]],
                    ['name' => 'Quiet Mat', 'short' => 'High-grip wellness mat with grounding texture.', 'price' => [55, 139]],
                    ['name' => 'Sleep Diffuser', 'short' => 'Mist diffuser for bedside scent routines.', 'price' => [34, 95]],
                    ['name' => 'Balance Blocks', 'short' => 'Foam blocks for mobility and yoga support.', 'price' => [18, 48]],
                    ['name' => 'Pulse Bottle', 'short' => 'Glass bottle with time-marked hydration prompts.', 'price' => [19, 52]],
                    ['name' => 'Recovery Gun', 'short' => 'Compact massage gun with silent motor.', 'price' => [89, 219]],
                    ['name' => 'Focus Timer', 'short' => 'Desk timer for breathwork and focus cycles.', 'price' => [24, 64]],
                    ['name' => 'Aroma Stones', 'short' => 'Reusable scent stones with tray and pipette.', 'price' => [16, 38]],
                    ['name' => 'Soothe Blanket', 'short' => 'Weighted blanket for calmer evening rest.', 'price' => [95, 239]],
                    ['name' => 'Meditation Cushion', 'short' => 'Textured cushion with supportive fill.', 'price' => [39, 99]],
                    ['name' => 'Hydrate Tabs', 'short' => 'Daily mineral hydration tablets.', 'price' => [14, 32]],
                    ['name' => 'Posture Strap', 'short' => 'Posture trainer for desk-heavy routines.', 'price' => [19, 49]],
                    ['name' => 'Recovery Ball Set', 'short' => 'Targeted massage ball duo for small muscle groups.', 'price' => [16, 39]],
                    ['name' => 'Herbal Soak', 'short' => 'Bath soak blend with eucalyptus and salt minerals.', 'price' => [18, 46]],
                    ['name' => 'Rise Alarm Light', 'short' => 'Sunrise alarm designed for softer mornings.', 'price' => [69, 179]],
                ],
            ],
        ];

        $categories = collect($categoryBlueprints)->map(function (array $category) {
            return Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                    'image' => $category['image'],
                    'is_active' => true,
                ]
            );
        })->keyBy('name');

        foreach ($categoryBlueprints as $categoryIndex => $categoryData) {
            $category = $categories[$categoryData['name']];

            foreach ($categoryData['products'] as $productIndex => $productData) {
                $seed = $categoryIndex * 100 + $productIndex + 1;
                $price = $this->seededPrice($productData['price'][0], $productData['price'][1], $seed);
                $sku = sprintf('%s-%03d', $categoryData['prefix'], $productIndex + 1);
                $name = sprintf('%s %s', $productData['name'], $this->editionLabel($productIndex));

                $product = Product::updateOrCreate(
                    ['sku' => $sku],
                    [
                        'category_id' => $category->id,
                        'name' => $name,
                        'slug' => Str::slug($name),
                        'short_description' => $productData['short'],
                        'description' => $this->buildDescription($categoryData['name'], $productData['name'], $productData['short'], $productIndex),
                        'price' => $price,
                        'compare_price' => round($price + max(15, $price * 0.15), 2),
                        'stock' => 12 + (($seed * 7) % 48),
                        'rating' => round(3.8 + (($seed % 12) * 0.1), 2),
                        'review_count' => 18 + (($seed * 13) % 220),
                        'is_active' => true,
                        'is_featured' => $productIndex < 3,
                    ]
                );

                ProductImage::updateOrCreate(
                    ['product_id' => $product->id, 'is_primary' => true],
                    ['path' => $this->categoryImageForSeed($categoryData['name'], $seed)]
                );
            }
        }
    }

    private function editionLabel(int $index): string
    {
        $labels = [
            'Studio', 'Midnight', 'Aero', 'Mono', 'Prime',
            'Signal', 'Atlas', 'Vista', 'Core', 'Wave',
            'Field', 'Drift', 'Mode', 'Element', 'Axis',
            'Summit', 'Circuit', 'Form', 'Slate', 'Edition',
        ];

        return $labels[$index % count($labels)];
    }

    private function seededPrice(int $min, int $max, int $seed): float
    {
        $range = max(1, $max - $min);

        return round($min + (($seed * 17) % $range), 2);
    }

    private function buildDescription(string $category, string $name, string $short, int $index): string
    {
        $finishes = ['matte ceramic', 'brushed alloy', 'woven textile', 'soft-touch composite', 'powder-coated steel'];
        $moods = ['calmer mornings', 'focused work blocks', 'small apartment setups', 'travel-heavy routines', 'late-night creative sessions'];

        return sprintf(
            '%s Built for %s, this %s edition balances premium materials, practical organization, and a polished silhouette. Finished in %s and tuned for %s.',
            $short,
            strtolower($category),
            $name,
            $finishes[$index % count($finishes)],
            $moods[$index % count($moods)]
        );
    }

    private function categoryImageForSeed(string $category, int $seed): string
    {
        $images = [
            'Lifestyle Tech' => [
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=1200&q=80',
            ],
            'Active Wear' => [
                'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
            ],
            'Home Studio' => [
                'https://images.unsplash.com/photo-1495576775051-8af0d10f19b1?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80',
            ],
            'Urban Living' => [
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80',
            ],
            'Travel Essentials' => [
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
            ],
            'Wellness Lab' => [
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        $options = $images[$category];

        return $options[$seed % count($options)];
    }
}
