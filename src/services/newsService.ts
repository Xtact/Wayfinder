import { RegionalNewsItem, ExpeditionType } from '../types/expedition';

export function getRegionalNewsAndAdvisories(
  locationName: string,
  type: ExpeditionType
): RegionalNewsItem[] {
  const loc = locationName.split(',')[0].trim();

  const baseItems: RegionalNewsItem[] = [
    {
      id: 'news-1',
      title: `Stage 1 Fire Restrictions in Effect for ${loc} Basin`,
      source: 'USFS / Interagency Fire Center',
      date: 'Updated 2 days ago',
      category: 'warning',
      summary: 'Wood and charcoal campfires prohibited outside designated developed metal fire rings. Portable gas stoves with shut-off valves permitted with California Campfire Permit.',
    },
    {
      id: 'news-2',
      title: 'Active Black Bear Activity Reported Near Lake Shore Trails',
      source: 'Wilderness Ranger District Bulletin',
      date: 'Updated 3 days ago',
      category: 'wildlife',
      summary: 'Certified bear-resistant canisters (IGBC approved) are strictly mandatory. All food, trash, and toiletries must be stored in canisters 100 feet downwind of sleeping areas.',
    },
    {
      id: 'news-3',
      title: 'Stream Crossing Hazard on High Elevation Drainage',
      source: 'Trail Conditions Report',
      date: 'Updated yesterday',
      category: 'trail_condition',
      summary: 'Afternoon snowmelt runoff causes rapid water level rises between 2:00 PM and 7:00 PM. Cross early morning when water volume is at minimum.',
    },
  ];

  if (type === 'fishing_trip') {
    baseItems.push({
      id: 'news-fish',
      title: 'Wilderness Trout Barbless Hook Regulations Active',
      source: 'State Fish & Wildlife Agency',
      date: 'Season Announcement',
      category: 'advisory',
      summary: 'Artificial lures with barbless single hooks only on wild trout protected stretches. Strict catch-and-release enforcement on native cutthroat waters.',
    });
  } else if (type === 'alpine_climb') {
    baseItems.push({
      id: 'news-climb',
      title: 'Loose Scree & Rockfall Alert Along North Ridge Couloir',
      source: 'Alpine Club Safety Advisory',
      date: 'This week',
      category: 'warning',
      summary: 'Freeze-thaw cycle is causing morning boulder release. Helmets mandatory at all times above the moraine.',
    });
  } else {
    baseItems.push({
      id: 'news-trail',
      title: 'Wilderness Permit Quotas & Trailhead Check-in Requirements',
      source: 'National Wilderness Preservation System',
      date: 'Active Season',
      category: 'general',
      summary: 'Please ensure your printed permit and vehicle parking stub are clearly visible on the dashboard to prevent citation and assist SAR tracking.',
    });
  }

  return baseItems;
}
