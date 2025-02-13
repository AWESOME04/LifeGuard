import 'package:flutter/material.dart';
class HealthTips extends StatefulWidget {
  const HealthTips({super.key});

  @override
  State<HealthTips> createState() => _HealthTipsState();
}

class _HealthTipsState extends State<HealthTips> {
  String selectedCategory = 'all';
  String searchQuery = '';
  bool isLoading = true;

  final categories = [
    {
      'id': 'emergency',
      'icon': Icons.local_hospital,
      'label': 'Emergency Care'
    },
    {'id': 'fitness', 'icon': Icons.directions_run, 'label': 'Fitness'},
    {'id': 'nutrition', 'icon': Icons.apple, 'label': 'Nutrition'},
    {'id': 'mental', 'icon': Icons.psychology, 'label': 'Mental Health'},
    {
      'id': 'prevention',
      'icon': Icons.health_and_safety,
      'label': 'Prevention'
    },
    {
      'id': 'resources',
      'icon': Icons.medical_information,
      'label': 'Resources'
    },
  ];

  // Define proper types for our data structures
  final Map<String, dynamic> featuredTip = {
    'title': "Today's Health Highlight",
    'description':
        "Learn about air quality monitoring and its impact on your health",
    'image': 'assets/images/med.png',
    'category': "prevention"
  };

  final List<Map<String, dynamic>> tips = [
    {
      'id': 1,
      'category': 'emergency',
      'title': 'Recognizing Heart Attack Symptoms',
      'description':
          'Learn the early warning signs of a heart attack and when to seek immediate medical attention.',
      'type': 'article'
    },
    {
      'id': 2,
      'category': 'fitness',
      'title': 'Quick 10-Minute Workouts',
      'description':
          'Effective exercises you can do anywhere to maintain your fitness levels.',
      'type': 'video',
      'videoUrl': 'https://youtube.com/watch?v=example'
    },
    {
      'id': 3,
      'category': 'nutrition',
      'title': 'Foods That Boost Immunity',
      'description': 'Discover the best foods to strengthen your immune system.',
      'type': 'article'
    },
    {
      'id': 4,
      'category': 'mental',
      'title': 'Stress Management Techniques',
      'description': 'Simple but effective ways to manage daily stress and anxiety.',
      'type': 'interactive'
    },
    {
      'id': 5,
      'category': 'prevention',
      'title': 'Air Quality Safety Tips',
      'description': 'How to protect yourself during poor air quality days.',
      'type': 'article'
    },
    {
      'id': 6,
      'category': 'resources',
      'title': 'Local Health Resources',
      'description': 'Find healthcare facilities and emergency services near you.',
      'type': 'tool'
    }
  ];

  final List<Map<String, String>> videos = [
    {
      'id': 'v1',
      'title': 'Emergency First Aid Basics',
      'videoUrl': 'https://www.youtube.com/embed/IisqrLOnqX8',
      'duration': '6:42'
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      setState(() => isLoading = false);
    }
  }

  List<Map<String, dynamic>> get filteredTips {
    return tips.where((tip) {
      final matchesCategory =
          selectedCategory == 'all' || tip['category'] == selectedCategory;
      final matchesSearch = searchQuery.isEmpty ||
          tip['title']
              .toString()
              .toLowerCase()
              .contains(searchQuery.toLowerCase()) ||
          tip['description']
              .toString()
              .toLowerCase()
              .contains(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Color(0xFF4285F4),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Health Tips',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: const Color(0xFF4285F4),
              ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Featured Section
          SliverToBoxAdapter(
            child: Container(
              height: 200,
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF007AFF), Color(0xFF00C6FF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Stack(
                children: [
                  Positioned(
                    right: 0,
                    bottom: 0,
                    top: 0,
                    width: MediaQuery.of(context).size.width * 0.4,
                    child: const ClipRRect(
                      borderRadius: BorderRadius.horizontal(
                        right: Radius.circular(20),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          featuredTip['title'],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          featuredTip['description'],
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 16,
                          ),
                        ),
                        const Spacer(),
                        ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF007AFF),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: const Text('Learn More'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                onChanged: (value) => setState(() => searchQuery = value),
                decoration: InputDecoration(
                  hintText: 'Search health tips...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(30),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
              ),
            ),
          ),

          // Categories
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  FilterChip(
                    label: const Text('All'),
                    selected: selectedCategory == 'all',
                    onSelected: (selected) {
                      setState(() => selectedCategory = 'all');
                    },
                  ),
                  const SizedBox(width: 8),
                  ...categories.map((category) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(category['label'] as String),
                          selected: selectedCategory == category['id'],
                          onSelected: (selected) {
                            setState(() =>
                                selectedCategory = category['id'] as String);
                          },
                          avatar: Icon(category['icon'] as IconData),
                        ),
                      )),
                ],
              ),
            ),
          ),

          // Tips Grid
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio:
                    MediaQuery.of(context).size.width > 600 ? 0.8 : 0.7,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final tip = filteredTips[index];
                  return _buildTipCard(tip, isDark);
                },
                childCount: filteredTips.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTipCard(Map<String, dynamic> tip, bool isDark) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (tip['type'] == 'video')
              const Icon(Icons.play_circle_fill, color: Colors.red),
            const SizedBox(height: 8),
            Text(
              tip['title'],
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Expanded(
              child: Text(
                tip['description'],
                style: TextStyle(
                  color: isDark ? Colors.white70 : Colors.black54,
                  fontSize: 14,
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Chip(
                    label: Text(
                      categories.firstWhere(
                              (cat) => cat['id'] == tip['category'])['label']
                          as String,
                      style: const TextStyle(fontSize: 12),
                    ),
                    backgroundColor: _getCategoryColor(tip['category']),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('Read More'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'emergency':
        return Colors.red.withOpacity(0.2);
      case 'fitness':
        return Colors.green.withOpacity(0.2);
      case 'nutrition':
        return Colors.purple.withOpacity(0.2);
      case 'mental':
        return Colors.blue.withOpacity(0.2);
      case 'prevention':
        return Colors.orange.withOpacity(0.2);
      case 'resources':
        return Colors.teal.withOpacity(0.2);
      default:
        return Colors.grey.withOpacity(0.2);
    }
  }
}
