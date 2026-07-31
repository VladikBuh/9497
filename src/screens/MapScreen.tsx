import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
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
import { Place } from '../types/places';
import { colors, fonts, radius } from '../constants/theme';

type MapScreenProps = {
  onOpenPlace: (id: string) => void;
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function MapScreen({
  onOpenPlace,
  activeTab,
  onTabPress,
}: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const [showTooltip, setShowTooltip] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    setShowTooltip(false);
  };

  const handleBack = () => setSelectedPlace(null);

  return (
    <View style={styles.MapScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.MapScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[colors.topGradientStart, colors.topGradientEnd]}
            style={styles.MapScreenTopGradientVeil}
          />

          {/* Header */}
          <View
            style={[styles.MapScreenHeaderLintel, { paddingTop: insets.top }]}
          >
            <View style={styles.MapScreenHeaderLeftLintel}>
              {selectedPlace ? (
                <AnimatedPressable
                  onPress={handleBack}
                  style={styles.MapScreenBackPortico}
                  hitSlop={12}
                >
                  <Image
                    source={require('../assets/into-explorer-backarrow.png')}
                    style={styles.MapScreenBackArrowSigil}
                    resizeMode="contain"
                  />
                </AnimatedPressable>
              ) : null}
              <Text style={styles.MapScreenTitleFiligree}>Map</Text>
            </View>
          </View>

          {/* Map container */}
          <View style={styles.MapScreenMapChassis}>
            <MapView
              style={styles.MapScreenMapSigil}
              userInterfaceStyle="dark"
              initialRegion={{
                latitude: 50,
                longitude: 20,
                latitudeDelta: 80,
                longitudeDelta: 100,
              }}
            >
              {PLACES.map(place => (
                <Marker
                  key={place.id}
                  coordinate={{ latitude: place.lat, longitude: place.lng }}
                  onPress={() => handleMarkerPress(place)}
                >
                  <Image
                    source={require('../assets/into-explorer-pin.png')}
                    style={styles.MapScreenPinSigil}
                    resizeMode="contain"
                  />
                </Marker>
              ))}
            </MapView>

            {/* Place popup card (pin selected) */}
            {selectedPlace ? (
              <FadeSlideIn
                key={selectedPlace.id}
                style={styles.MapScreenPlaceCardChassis}
                distance={12}
                duration={280}
              >
                <Image
                  source={selectedPlace.image}
                  style={styles.MapScreenPlaceImageSigil}
                  resizeMode="cover"
                />
                <Text style={styles.MapScreenPlaceNameFiligree}>
                  {selectedPlace.name}
                </Text>
                <Text style={styles.MapScreenPlaceCoordsFiligree}>
                  Coordinates: {selectedPlace.coordinates}
                </Text>
                <AnimatedPressable
                  onPress={() => onOpenPlace(selectedPlace.id)}
                  style={styles.MapScreenOpenPortico}
                >
                  <Text style={styles.MapScreenOpenFiligree}>Open more</Text>
                  <Image
                    source={require('../assets/into-explorer-icon-arrow.png')}
                    style={styles.MapScreenArrowSigil}
                    resizeMode="contain"
                  />
                </AnimatedPressable>
              </FadeSlideIn>
            ) : null}
          </View>
          <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  MapScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  MapScreenBackground: {
    flex: 1,
  },
  MapScreenTopGradientVeil: {
    height: 205,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  MapScreenHeaderLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  MapScreenHeaderLeftLintel: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  MapScreenBackPortico: {
    marginRight: 8,
  },
  MapScreenBackArrowSigil: {
    height: 24,
    width: 24,
  },

  MapScreenBackFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 24,
  },

  MapScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
  },

  MapScreenMapChassis: {
    borderRadius: 22,
    flex: 1,
    marginBottom: TAB_BAR_TOTAL_HEIGHT + 50,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  MapScreenMapSigil: {
    flex: 1,
  },
  MapScreenTooltipChassis: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    left: '50%',
    marginLeft: -(242 / 2),
    overflow: 'hidden',
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 36,
    paddingTop: 14,
    position: 'absolute',
    top: 8,
    width: 242,
  },

  MapScreenPinSigil: {
    height: 30,
    width: 30,
  },
  MapScreenTooltipClosePortico: {
    position: 'absolute',
    right: 8,
    top: 6,
  },
  MapScreenTooltipCloseFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
  MapScreenTooltipFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  MapScreenPlaceCardChassis: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  MapScreenPlaceImageSigil: {
    height: 172,
    width: '100%',
  },

  MapScreenPlaceNameFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginLeft: 14,
    marginTop: 14,
  },

  MapScreenPlaceCoordsFiligree: {
    color: colors.placeCoords,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginLeft: 14,
    marginTop: 6,
  },
  MapScreenOpenPortico: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
    marginLeft: 14,
    marginTop: 8,
  },
  MapScreenArrowSigil: {
    height: 16,
    tintColor: colors.openMore,

    width: 16,
  },

  MapScreenOpenFiligree: {
    color: colors.openMore,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
});
