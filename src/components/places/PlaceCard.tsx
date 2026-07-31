import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../animated/AnimatedPressable';
import { colors, fonts, radius } from '../../constants/theme';
import { Place } from '../../types/places';

type PlaceCardProps = {
  place: Place;
  onPress: () => void;
};

export function PlaceCard({ place, onPress }: PlaceCardProps) {
  return (
    <View style={styles.PlaceCardFacetChassis}>
      <Image
        source={place.image}
        style={styles.PlaceCardImageSigil}
        resizeMode="cover"
      />
      <Text style={styles.PlaceCardNameFiligree}>{place.name}</Text>
      <Text style={styles.PlaceCardCoordsFiligree}>
        Coordinates: {place.coordinates}
      </Text>
      <AnimatedPressable onPress={onPress} style={styles.PlaceCardOpenPortico}>
        <Text style={styles.PlaceCardOpenFiligree}>Open more</Text>
        <Image
          source={require('../../assets/into-explorer-icon-arrow.png')}
          style={styles.PlaceCardArrowSigil}
          resizeMode="contain"
        />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  PlaceCardFacetChassis: {
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    width: '100%',
  },
  PlaceCardImageSigil: {
    height: 172,
    width: '100%',
  },
  PlaceCardNameFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    marginLeft: 14,
    marginTop: 14,
  },
  PlaceCardCoordsFiligree: {
    color: colors.placeCoords,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginLeft: 14,
    marginTop: 6,
  },
  PlaceCardOpenPortico: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
    marginLeft: 14,
    marginTop: 8,
  },
  PlaceCardOpenFiligree: {
    color: colors.openMore,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  PlaceCardArrowSigil: {
    height: 16,
    tintColor: colors.openMore,
    width: 16,
  },
});
