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
import MapView, { Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components/animated/AnimatedPressable';
import { FadeSlideIn } from '../components/animated/FadeSlideIn';
import { TabBar, TAB_BAR_TOTAL_HEIGHT } from '../components/nav/TabBar';
import { PLACES } from '../data/places';

import { colors, fonts, radius, spacing } from '../constants/theme';

type PlaceDetailScreenProps = {
  placeId: string;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function PlaceDetailScreen({
  placeId,
  onBack,
  isSaved,
  onToggleSave,
  activeTab,
  onTabPress,
}: PlaceDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [showMap, setShowMap] = useState(false);

  const place = PLACES.find(p => p.id === placeId)!;

  const handleShare = () => {
    Share.share({
      title: place.name,
      message: `${place.name}\n\nCoordinates: ${place.coordinates}\n\n${place.description}`,
    });
  };

  return (
    <View style={styles.PlaceDetailScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.PlaceDetailScreenBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[colors.topGradientStart, colors.topGradientEnd]}
          style={styles.PlaceDetailScreenTopGradientVeil}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.PlaceDetailScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          <View
            style={[
              styles.PlaceDetailScreenHeaderLintel,
              { paddingTop: insets.top },
            ]}
          >
            <View style={styles.PlaceDetailScreenHeaderLeftLintel}>
              <AnimatedPressable
                onPress={onBack}
                style={styles.PlaceDetailScreenBackPortico}
                hitSlop={12}
              >
                <Image
                  source={require('../assets/into-explorer-backarrow.png')}
                  style={styles.PlaceDetailScreenBackArrowSigil}
                  resizeMode="contain"
                />
              </AnimatedPressable>
              <Text style={styles.PlaceDetailScreenTitleFiligree}>Places</Text>
            </View>
          </View>
          {/* Card */}
          <FadeSlideIn style={styles.PlaceDetailScreenCardChassis}>
            {/* Place image */}
            <Image
              source={place.image}
              style={styles.PlaceDetailScreenImageSigil}
              resizeMode="cover"
            />

            {/* Map toggle button */}
            <AnimatedPressable
              onPress={() => setShowMap(prev => !prev)}
              style={styles.PlaceDetailScreenMapTogglePortico}
            >
              {showMap ? (
                <LinearGradient
                  colors={['#717171', '#d7d7d7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.PlaceDetailScreenMapCloseLintel}
                >
                  <Text style={styles.PlaceDetailScreenMapToggleEmojiSigil}>
                    🗺️
                  </Text>
                  <Text style={styles.PlaceDetailScreenMapCloseFiligree}>
                    Close
                  </Text>
                </LinearGradient>
              ) : (
                <LinearGradient
                  colors={[colors.btnGradientStart, colors.btnGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.PlaceDetailScreenMapOpenLintel}
                >
                  <Text style={styles.PlaceDetailScreenMapToggleEmojiSigil}>
                    🗺️
                  </Text>
                </LinearGradient>
              )}
            </AnimatedPressable>

            {/* Info */}
            <Text style={styles.PlaceDetailScreenNameFiligree}>
              {place.name}
            </Text>
            <Text style={styles.PlaceDetailScreenCoordsFiligree}>
              Coordinates: {place.coordinates}
            </Text>

            {/* Map or description */}
            {showMap ? (
              <View
                renderToHardwareTextureAndroid
                collapsable={false}
                style={{
                  flex: 1,
                  width: '100%',
                  marginTop: 12,
                  borderRadius: 22,
                  overflow: 'hidden',
                }}
              >
                <MapView
                  userInterfaceStyle="dark"
                  style={styles.PlaceDetailScreenMapSigil}
                  region={{
                    latitude: place.lat,
                    longitude: place.lng,
                    latitudeDelta: 0.8,
                    longitudeDelta: 0.8,
                  }}
                >
                  <Marker
                    coordinate={{ latitude: place.lat, longitude: place.lng }}
                    title={place.name}
                  >
                    <Image
                      source={require('../assets/into-explorer-pin.png')}
                      style={styles.PlaceDetailScreenPinSigil}
                      resizeMode="contain"
                    />
                  </Marker>
                </MapView>
              </View>
            ) : (
              <>
                <Text style={styles.PlaceDetailScreenDescFiligree}>
                  {place.description}
                </Text>

                {/* Action buttons */}
                <View style={styles.PlaceDetailScreenActionsLintel}>
                  <AnimatedPressable
                    onPress={handleShare}
                    style={styles.PlaceDetailScreenSharePortico}
                  >
                    <LinearGradient
                      colors={[colors.shareGradStart, colors.shareGradEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.PlaceDetailScreenBtnLintel}
                    >
                      <Image
                        source={require('../assets/into-explorer-icon-share.png')}
                        style={styles.PlaceDetailScreenIconSigil}
                        resizeMode="contain"
                      />
                      <Text style={styles.PlaceDetailScreenBtnFiligree}>
                        Share
                      </Text>
                    </LinearGradient>
                  </AnimatedPressable>

                  <AnimatedPressable
                    onPress={onToggleSave}
                    style={styles.PlaceDetailScreenSavePortico}
                  >
                    {isSaved ? (
                      <LinearGradient
                        colors={[colors.saveGradStart, colors.saveGradEnd]}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.PlaceDetailScreenBtnLintel}
                      >
                        <Text style={styles.PlaceDetailScreenBtnEmojiSigil}>
                          💚
                        </Text>
                        <Text style={styles.PlaceDetailScreenBtnFiligree}>
                          Save
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.PlaceDetailScreenSaveOutlineLintel}>
                        <Text style={styles.PlaceDetailScreenBtnEmojiSigil}>
                          🤍
                        </Text>
                        <Text style={styles.PlaceDetailScreenBtnFiligree}>
                          Save
                        </Text>
                      </View>
                    )}
                  </AnimatedPressable>
                </View>
              </>
            )}
          </FadeSlideIn>
        </ScrollView>

        <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  PlaceDetailScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },

  PlaceDetailScreenBackground: {
    flex: 1,
  },

  PlaceDetailScreenTopGradientVeil: {
    height: 205,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  PlaceDetailScreenHeaderLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  PlaceDetailScreenHeaderLeftLintel: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  PlaceDetailScreenBackPortico: {
    marginRight: 8,
  },
  PlaceDetailScreenBackArrowSigil: {
    height: 24,
    width: 24,
  },
  PlaceDetailScreenBackFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 24,
  },
  PlaceDetailScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
  },

  PlaceDetailScreenScrollLintel: {},
  PlaceDetailScreenCardChassis: {
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    width: '90%',
  },
  PlaceDetailScreenImageSigil: {
    height: 172,
    width: '100%',
  },
  PlaceDetailScreenMapTogglePortico: {
    borderRadius: radius.button,
    bottom: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 16,
    top: 109,
  },

  PlaceDetailScreenMapOpenLintel: {
    alignItems: 'center',
    height: 47,
    justifyContent: 'center',
    width: 47,
    borderRadius: 10,
  },
  PlaceDetailScreenMapCloseLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 47,
    justifyContent: 'center',
    width: 96,
    borderRadius: 10,
  },

  PlaceDetailScreenMapToggleEmojiSigil: {
    fontSize: 20,
  },
  PlaceDetailScreenMapCloseFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    marginLeft: 4,
  },
  PlaceDetailScreenNameFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginLeft: 14,
    marginTop: 14,
  },
  PlaceDetailScreenCoordsFiligree: {
    color: colors.placeCoords,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginLeft: 14,
    marginTop: 6,
  },
  PlaceDetailScreenDescFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 22,
    marginHorizontal: 14,
    marginTop: 12,
  },
  PlaceDetailScreenMapSigil: {
    height: 360,
    margin: 14,
    borderRadius: 22,
    overflow: 'hidden',
  },

  PlaceDetailScreenActionsLintel: {
    flexDirection: 'row',
    gap: 15,
    margin: 14,
    marginTop: 16,
  },
  PlaceDetailScreenSharePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },
  PlaceDetailScreenSavePortico: {
    borderRadius: radius.button,
    height: 47,
    overflow: 'hidden',
    width: 108,
  },
  PlaceDetailScreenBtnLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
  },

  PlaceDetailScreenSaveOutlineLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.8)',
    borderWidth: 0.9,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
  },
  PlaceDetailScreenIconSigil: {
    height: 22,
    width: 22,
  },
  PlaceDetailScreenPinSigil: {
    height: 30,
    width: 30,
  },
  PlaceDetailScreenBtnEmojiSigil: {
    fontSize: 18,
  },

  PlaceDetailScreenBtnFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
});
