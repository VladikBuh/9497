import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components/animated/AnimatedPressable';
import { FadeSlideIn } from '../components/animated/FadeSlideIn';
import { TabBar, TAB_BAR_TOTAL_HEIGHT } from '../components/nav/TabBar';
import { PlaceCard } from '../components/places/PlaceCard';
import { PLACES, PLACE_CATEGORIES } from '../data/places';
import { FACTS } from '../data/facts';
import { PlaceCategory } from '../types/places';
import { colors, fonts, radius, spacing } from '../constants/theme';

type SavedTab = 'places' | 'facts';

type SavedScreenProps = {
  savedPlaceIds: Set<string>;
  savedFactIds: Set<number>;
  onToggleSavePlace: (id: string) => void;
  onToggleSaveFact: (id: number) => void;
  onOpenPlace: (id: string) => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function SavedScreen({
  savedPlaceIds,
  savedFactIds,
  onToggleSaveFact,
  onOpenPlace,
  activeTab,
  onTabPress,
}: SavedScreenProps) {
  const insets = useSafeAreaInsets();
  const [savedTab, setSavedTab] = useState<SavedTab>('places');
  const [placeCategory, setPlaceCategory] =
    useState<PlaceCategory>('frozen-lakes');

  const savedPlaces = PLACES.filter(
    p => savedPlaceIds.has(p.id) && p.category === placeCategory,
  );
  const savedFacts = FACTS.filter(f => savedFactIds.has(f.id));

  const isEmpty =
    savedTab === 'places' ? savedPlaces.length === 0 : savedFacts.length === 0;

  return (
    <View style={styles.SavedScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.SavedScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.SavedScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          {/* Header with gradient */}
          <View style={styles.SavedScreenHeaderChassis}>
            <LinearGradient
              colors={[colors.topGradientStart, colors.topGradientEnd]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.SavedScreenHeaderInset,
                { paddingTop: insets.top },
              ]}
            >
              <Text style={styles.SavedScreenTitleFiligree}>Saved</Text>
            </View>
          </View>

          <View style={styles.SavedScreenContentChassis}>
            {/* Search bar */}
            <View style={styles.SavedScreenSearchLintel}>
              <Text style={styles.SavedScreenSearchEmojiSigil}>🔍</Text>
              <Text style={styles.SavedScreenSearchFiligree}>
                Search saved...
              </Text>
            </View>

            {/* Top tabs: Places | Winter Facts */}
            <View style={styles.SavedScreenTabsLintel}>
              <AnimatedPressable
                onPress={() => setSavedTab('places')}
                style={[
                  styles.SavedScreenTabPortico,
                  savedTab !== 'places' && styles.SavedScreenTabInactivePortico,
                ]}
              >
                <Text style={styles.SavedScreenTabFiligree}>Places</Text>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={() => setSavedTab('facts')}
                style={[
                  styles.SavedScreenTabPortico,
                  savedTab !== 'facts' && styles.SavedScreenTabInactivePortico,
                ]}
              >
                <Text style={styles.SavedScreenTabFiligree}>Winter Facts</Text>
              </AnimatedPressable>
            </View>

            {/* Sub-chips (Places only) */}
            {savedTab === 'places' && (
              <View style={styles.SavedScreenSubChipsLintel}>
                {PLACE_CATEGORIES.map(cat => (
                  <AnimatedPressable
                    key={cat.key}
                    onPress={() => setPlaceCategory(cat.key)}
                    style={[
                      styles.SavedScreenChipPortico,
                      cat.key !== placeCategory &&
                        styles.SavedScreenChipInactivePortico,
                    ]}
                  >
                    <Text style={styles.SavedScreenChipFiligree}>
                      {cat.label}
                    </Text>
                  </AnimatedPressable>
                ))}
              </View>
            )}

            {/* Content */}
            <FadeSlideIn key={`${savedTab}-${placeCategory}`}>
              {isEmpty ? (
                <View style={styles.SavedScreenEmptyChassis}>
                  <View style={styles.SavedScreenEmptyCardChassis}>
                    <Text style={styles.SavedScreenEmptyFiligree}>
                      You don't have anything saved yet. Check out the app, you
                      might find something you like!
                    </Text>
                  </View>

                  <AnimatedPressable
                    onPress={() => onTabPress(0)}
                    scaleStyle={{ width: '60%' }}
                  >
                    {({ pressed }) => (
                      <LinearGradient
                        colors={[colors.btnGradientStart, colors.btnGradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.SavedScreenEmptyBtnLintel,
                          pressed && styles.SavedScreenBtnPressedDim,
                        ]}
                      >
                        <Text style={styles.SavedScreenEmptyBtnFiligree}>
                          Places
                        </Text>
                      </LinearGradient>
                    )}
                  </AnimatedPressable>

                  <AnimatedPressable
                    onPress={() => onTabPress(2)}
                    scaleStyle={{ width: '60%' }}
                  >
                    {({ pressed }) => (
                      <LinearGradient
                        colors={[colors.btnGradientStart, colors.btnGradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          styles.SavedScreenEmptyBtnLintel,
                          pressed && styles.SavedScreenBtnPressedDim,
                        ]}
                      >
                        <Text style={styles.SavedScreenEmptyBtnFiligree}>
                          Winter Facts
                        </Text>
                      </LinearGradient>
                    )}
                  </AnimatedPressable>

                  <Image
                    source={require('../assets/into-explorer-onboardimg4.png')}
                    style={styles.SavedScreenEmptyImageSigil}
                    resizeMode="contain"
                  />
                </View>
              ) : savedTab === 'places' ? (
                savedPlaces.map(place => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onPress={() => onOpenPlace(place.id)}
                  />
                ))
              ) : (
                savedFacts.map(fact => (
                  <View key={fact.id} style={styles.SavedScreenFactCardChassis}>
                    <Text style={styles.SavedScreenFactLabelFiligree}>
                      This is interesting:
                    </Text>
                    <Text style={styles.SavedScreenFactTextFiligree}>
                      {fact.text}
                    </Text>
                    <View style={styles.SavedScreenFactActionsLintel}>
                      <AnimatedPressable
                        onPress={() => Share.share({message: fact.text})}
                        style={styles.SavedScreenSharePortico}>
                        <LinearGradient
                          colors={[colors.shareGradStart, colors.shareGradEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.SavedScreenBtnLintel}
                        >
                          <Image
                            source={require('../assets/into-explorer-icon-share.png')}
                            style={styles.SavedScreenIconSigil}
                            resizeMode="contain"
                          />
                          <Text style={styles.SavedScreenBtnFiligree}>Share</Text>
                        </LinearGradient>
                      </AnimatedPressable>
                      <AnimatedPressable
                        onPress={() => onToggleSaveFact(fact.id)}
                        style={styles.SavedScreenSavePortico}
                      >
                        <View style={styles.SavedScreenSaveOutlineLintel}>
                          <Text style={styles.SavedScreenBtnEmojiSigil}>🤍</Text>
                          <Text style={styles.SavedScreenBtnFiligree}>Save</Text>
                        </View>
                      </AnimatedPressable>
                    </View>
                  </View>
                ))
              )}
            </FadeSlideIn>
          </View>
        </ScrollView>

        <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  SavedScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },

  SavedScreenBackground: {
    flex: 1,
  },
  SavedScreenScrollLintel: {
    flexGrow: 1,
  },
  SavedScreenHeaderChassis: {
    overflow: 'hidden',
  },
  SavedScreenHeaderInset: {
    paddingHorizontal: 16,
  },
  SavedScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
    marginBottom: 16,
    marginTop: 8,
  },

  SavedScreenContentChassis: {
    paddingHorizontal: 16,
  },

  SavedScreenSearchLintel: {
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
  SavedScreenSearchEmojiSigil: {
    fontSize: 18,
    marginRight: 8,
  },
  SavedScreenSearchFiligree: {
    color: colors.searchPlaceholder,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
  },
  SavedScreenTabsLintel: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  SavedScreenTabPortico: {
    alignItems: 'center',
    backgroundColor: colors.chipBg,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.button,
    borderWidth: 0.5,
    height: 34,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  SavedScreenTabInactivePortico: {
    opacity: 0.72,
  },
  SavedScreenTabFiligree: {
    color: colors.chipText,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  SavedScreenSubChipsLintel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  SavedScreenChipPortico: {
    alignItems: 'center',
    backgroundColor: colors.chipBg,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.button,
    borderWidth: 0.5,
    height: 34,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },

  SavedScreenChipInactivePortico: {
    opacity: 0.72,
  },
  SavedScreenChipFiligree: {
    color: colors.chipText,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  SavedScreenEmptyChassis: {
    alignItems: 'center',
    gap: 12,
  },

  SavedScreenEmptyCardChassis: {
    alignSelf: 'stretch',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 15,
  },
  SavedScreenEmptyFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 21,
  },

  SavedScreenEmptyBtnLintel: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.button,
    borderWidth: 0.5,
    height: 56,
    justifyContent: 'center',
  },
  SavedScreenBtnPressedDim: {
    opacity: 0.85,
  },
  SavedScreenEmptyBtnFiligree: {
    color: colors.white,
    fontFamily: fonts.sansMedium,
    fontSize: 20,
  },
  SavedScreenEmptyImageSigil: {
    height: 200,
    marginTop: 8,
    width: 140,
  },

  SavedScreenFactCardChassis: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  SavedScreenFactLabelFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginBottom: 8,
  },
  SavedScreenFactTextFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 16,
  },

  SavedScreenFactActionsLintel: {
    flexDirection: 'row',
    gap: 15,
  },
  SavedScreenSharePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },
  SavedScreenSavePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },
  SavedScreenBtnLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },

  SavedScreenSaveOutlineLintel: {
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  SavedScreenIconSigil: {
    height: 22,
    width: 22,
  },
  SavedScreenBtnEmojiSigil: {
    fontSize: 18,
  },

  SavedScreenBtnFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
});
