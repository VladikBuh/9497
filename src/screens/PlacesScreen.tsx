import React, { useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components/animated/AnimatedPressable';
import { FadeSlideIn } from '../components/animated/FadeSlideIn';
import { PlaceCard } from '../components/places/PlaceCard';
import { TabBar, TAB_BAR_TOTAL_HEIGHT } from '../components/nav/TabBar';
import { PLACE_CATEGORIES, PLACES } from '../data/places';
import { PlaceCategory } from '../types/places';

import { colors, fonts, radius, spacing } from '../constants/theme';

type PlacesScreenProps = {
  onOpenPlace: (id: string) => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function PlacesScreen({
  onOpenPlace,
  activeTab,
  onTabPress,
}: PlacesScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] =
    useState<PlaceCategory>('frozen-lakes');

  const filtered = PLACES.filter(p => p.category === activeCategory);

  return (
    <View style={styles.PlacesScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.PlacesScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.PlacesScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          <View style={styles.PlacesScreenHeaderChassis}>
            <LinearGradient
              colors={[colors.topGradientStart, colors.topGradientEnd]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.PlacesScreenHeaderInset,
                { paddingTop: insets.top },
              ]}
            >
              <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
                <Text style={styles.PlacesScreenTitleFiligree}>Places</Text>

                <View style={styles.PlacesScreenSearchLintel}>
                  <Text style={styles.PlacesScreenSearchEmojiSigil}>🔍</Text>
                  <Text style={styles.PlacesScreenSearchFiligree}>
                    Search places...
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.PlacesScreenChipsLintel}
              >
                {PLACE_CATEGORIES.map(cat => (
                  <AnimatedPressable
                    key={cat.key}
                    onPress={() => setActiveCategory(cat.key)}
                    style={[
                      styles.PlacesScreenChipPortico,
                      cat.key !== activeCategory &&
                        styles.PlacesScreenChipInactivePortico,
                    ]}
                  >
                    <Text style={styles.PlacesScreenChipFiligree}>
                      {cat.label}
                    </Text>
                  </AnimatedPressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <FadeSlideIn key={activeCategory} style={styles.PlacesScreenListChassis}>
            {filtered.map(item => (
              <PlaceCard
                key={item.id}
                place={item}
                onPress={() => onOpenPlace(item.id)}
              />
            ))}
          </FadeSlideIn>
        </ScrollView>

        <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  PlacesScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  PlacesScreenBackground: {
    flex: 1,
  },
  PlacesScreenScrollLintel: {
    flexGrow: 1,
  },
  PlacesScreenHeaderChassis: {
    overflow: 'hidden',
  },
  PlacesScreenHeaderInset: {},
  PlacesScreenListChassis: {
    paddingTop: 4,
    paddingHorizontal: 16,
  },

  PlacesScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
    marginBottom: 12,
    marginTop: 8,
  },

  PlacesScreenSearchLintel: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    marginBottom: 15,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  PlacesScreenSearchEmojiSigil: {
    fontSize: 18,
    marginRight: 8,
  },
  PlacesScreenSearchFiligree: {
    color: colors.searchPlaceholder,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
  },
  PlacesScreenChipsLintel: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
    paddingLeft: 16,
  },

  PlacesScreenChipPortico: {
    alignItems: 'center',
    backgroundColor: colors.chipBg,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.button,
    borderWidth: 0.5,
    height: 34,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  PlacesScreenChipInactivePortico: {
    opacity: 0.72,
  },

  PlacesScreenChipFiligree: {
    color: colors.chipText,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
});
