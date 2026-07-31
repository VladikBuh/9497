import React from 'react';
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

import { FACTS } from '../data/facts';

import { colors, fonts, radius, spacing } from '../constants/theme';

type FactsScreenProps = {
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function FactsScreen({
  savedIds,
  onToggleSave,
  activeTab,
  onTabPress,
}: FactsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.FactsScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.FactsScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.FactsScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          <View style={styles.FactsScreenHeaderChassis}>
            <LinearGradient
              colors={[colors.topGradientStart, colors.topGradientEnd]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.FactsScreenHeaderInset,
                { paddingTop: insets.top },
              ]}
            >
              <Text style={styles.FactsScreenTitleFiligree}>Winter Facts</Text>
            </View>
          </View>

          <View style={styles.FactsScreenListChassis}>
            {FACTS.map((item, index) => {
              const isSaved = savedIds.has(item.id);
              return (
                <FadeSlideIn
                  key={item.id}
                  style={styles.FactsScreenCardChassis}
                  delay={Math.min(index, 6) * 60}
                >
                  <Text style={styles.FactsScreenLabelFiligree}>
                    This is interesting:
                  </Text>
                  <Text style={styles.FactsScreenTextFiligree}>
                    {item.text}
                  </Text>

                  <View style={styles.FactsScreenActionsLintel}>
                    <AnimatedPressable
                      onPress={() => Share.share({ message: item.text })}
                      style={styles.FactsScreenSharePortico}
                    >
                      <LinearGradient
                        colors={[colors.shareGradStart, colors.shareGradEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.FactsScreenBtnLintel}
                      >
                        <Image
                          source={require('../assets/into-explorer-icon-share.png')}
                          style={styles.FactsScreenIconSigil}
                          resizeMode="contain"
                        />
                        <Text style={styles.FactsScreenBtnFiligree}>Share</Text>
                      </LinearGradient>
                    </AnimatedPressable>

                    <AnimatedPressable
                      onPress={() => onToggleSave(item.id)}
                      style={styles.FactsScreenSavePortico}
                    >
                      {isSaved ? (
                        <LinearGradient
                          colors={[colors.saveGradStart, colors.saveGradEnd]}
                          start={{ x: 1, y: 0 }}
                          end={{ x: 0, y: 0 }}
                          style={styles.FactsScreenBtnLintel}
                        >
                          <Text style={styles.FactsScreenBtnEmojiSigil}>
                            💚
                          </Text>
                          <Text style={styles.FactsScreenBtnFiligree}>
                            Save
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.FactsScreenSaveOutlineLintel}>
                          <Text style={styles.FactsScreenBtnEmojiSigil}>
                            🤍
                          </Text>
                          <Text style={styles.FactsScreenBtnFiligree}>
                            Save
                          </Text>
                        </View>
                      )}
                    </AnimatedPressable>
                  </View>
                </FadeSlideIn>
              );
            })}
          </View>
        </ScrollView>

        <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  FactsScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  FactsScreenBackground: {
    flex: 1,
  },
  FactsScreenScrollLintel: {
    flexGrow: 1,
  },
  FactsScreenHeaderChassis: {
    overflow: 'hidden',
  },
  FactsScreenHeaderInset: {
    paddingHorizontal: 16,
  },
  FactsScreenListChassis: {
    paddingHorizontal: 16,
  },
  FactsScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
    marginBottom: 16,
    marginTop: 8,
  },
  FactsScreenCardChassis: {
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

  FactsScreenLabelFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginBottom: 8,
  },

  FactsScreenTextFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 16,
  },
  FactsScreenActionsLintel: {
    flexDirection: 'row',
    gap: 15,
  },
  FactsScreenSharePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },
  FactsScreenSavePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },

  FactsScreenBtnLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  FactsScreenSaveOutlineLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  FactsScreenIconSigil: {
    height: 22,
    width: 22,
  },
  FactsScreenBtnEmojiSigil: {
    fontSize: 18,
  },

  FactsScreenBtnFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
});
