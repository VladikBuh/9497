import React from 'react';
import {
  Image,
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
import { TabBar, TAB_BAR_TOTAL_HEIGHT } from '../components/nav/TabBar';
import { MOODS } from '../data/compass';

import { colors, fonts, radius, spacing } from '../constants/theme';

type CompassScreenProps = {
  onOpenPlace: (id: string) => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function CompassScreen({
  onOpenPlace,
  activeTab,
  onTabPress,
}: CompassScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.CompassScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.CompassScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.CompassScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          {/* Header with gradient */}
          <View style={styles.CompassScreenHeaderChassis}>
            <LinearGradient
              colors={[colors.topGradientStart, colors.topGradientEnd]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.CompassScreenHeaderInset,
                { paddingTop: insets.top },
              ]}
            >
              <Text style={styles.CompassScreenTitleFiligree}>
                Winter Mood Compass
              </Text>
            </View>
          </View>

          <View style={styles.CompassScreenContentChassis}>
            {/* Compass image */}
            <Image
              source={require('../assets/into-explorer-onboardimg5.png')}
              style={styles.CompassScreenCompassSigil}
              resizeMode="contain"
            />

            {/* Prompt card */}
            <View style={styles.CompassScreenPromptChassis}>
              <Text style={styles.CompassScreenPromptFiligree}>
                What's your winter mood today?
              </Text>
            </View>

            {/* Mood cards */}
            {MOODS.map((mood, index) => (
              <FadeSlideIn
                key={mood.id}
                style={styles.CompassScreenMoodLintel}
                delay={index * 60}
              >
                <AnimatedPressable
                  onPress={() => onOpenPlace(mood.placeId)}
                  style={styles.CompassScreenMoodChassis}
                >
                  {/* Arrow badge */}
                  <LinearGradient
                    colors={['rgba(109,206,255,0.88)', 'rgba(255,153,209,0.88)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.CompassScreenArrowSigil}
                  >
                    <Image
                      source={require('../assets/into-explorer-icon-arrow.png')}
                      style={styles.CompassScreenArrowIconSigil}
                      resizeMode="contain"
                    />
                  </LinearGradient>

                  <Text style={styles.CompassScreenMoodTitleFiligree}>
                    {mood.emoji} {mood.title}
                  </Text>
                  <Text
                    style={styles.CompassScreenMoodDescFiligree}
                    numberOfLines={3}
                  >
                    {mood.description}
                  </Text>
                </AnimatedPressable>
              </FadeSlideIn>
            ))}
          </View>
        </ScrollView>

        <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  CompassScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  CompassScreenBackground: {
    flex: 1,
  },

  CompassScreenScrollLintel: {
    flexGrow: 1,
  },
  CompassScreenHeaderChassis: {
    overflow: 'hidden',
  },
  CompassScreenHeaderInset: {
    paddingHorizontal: 16,
  },

  CompassScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 16,
    marginTop: 8,
    width: 231,
  },
  CompassScreenContentChassis: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  CompassScreenCompassSigil: {
    height: 204,
    marginBottom: 16,
    width: 240,
  },
  CompassScreenPromptChassis: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(161,224,255,0.76)',
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    height: 51,
    justifyContent: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  CompassScreenPromptFiligree: {
    color: '#000000',
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    textAlign: 'center',
  },

  CompassScreenMoodLintel: {
    alignSelf: 'stretch',
  },
  CompassScreenMoodChassis: {
    alignSelf: 'stretch',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 15,
    minHeight: 120,
    overflow: 'hidden',
    paddingBottom: 14,
    paddingLeft: 15,
    paddingRight: 50,
    paddingTop: 14,
  },

  CompassScreenArrowSigil: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 34,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: 10,
    top: 8,
    width: 32,
  },
  CompassScreenArrowIconSigil: {
    height: 18,
    width: 18,
  },
  CompassScreenArrowFiligree: {
    color: '#000000',
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
  },
  CompassScreenMoodTitleFiligree: {
    color: '#000000',
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginBottom: 8,
  },

  CompassScreenMoodDescFiligree: {
    color: '#000000',
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    lineHeight: 18,
    width: 291,
  },
});
