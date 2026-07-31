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

import { ARTICLES } from '../data/blog';

import { colors, fonts, radius, spacing } from '../constants/theme';

type BlogScreenProps = {
  activeTab: number;
  onTabPress: (index: number) => void;
};

export function BlogScreen({ activeTab, onTabPress }: BlogScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const article = selectedId ? ARTICLES.find(a => a.id === selectedId) : null;

  if (article) {
    return (
      <View style={styles.BlogScreenFacetChassis}>
        <ImageBackground
          source={require('../assets/into-explorer-background.png')}
          style={styles.BlogScreenBackground}
          resizeMode="cover"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={[
              styles.BlogScreenScrollLintel,
              {
                paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l,
              },
            ]}
          >
            <View style={styles.BlogScreenArticleHeaderChassis}>
              <LinearGradient
                colors={[colors.topGradientStart, colors.topGradientEnd]}
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  styles.BlogScreenArticleHeaderInset,
                  { paddingTop: insets.top },
                ]}
              >
                <View style={styles.BlogScreenArticleHeaderLeftLintel}>
                  <AnimatedPressable
                    onPress={() => setSelectedId(null)}
                    style={styles.BlogScreenBackPortico}
                    hitSlop={12}
                  >
                    <Image
                      source={require('../assets/into-explorer-backarrow.png')}
                      style={styles.BlogScreenBackArrowSigil}
                      resizeMode="contain"
                    />
                  </AnimatedPressable>
                  <Text style={styles.BlogScreenTitleFiligree}>
                    Winter Blog
                  </Text>
                </View>
              </View>
            </View>

            <FadeSlideIn key={article.id} style={styles.BlogScreenArticleChassis}>
              <Text style={styles.BlogScreenArticleTitleFiligree}>
                {article.title}
              </Text>
              {article.paragraphs.map((para, i) => (
                <Text key={i} style={styles.BlogScreenArticleParaFiligree}>
                  {para}
                </Text>
              ))}

              <AnimatedPressable
                onPress={() =>
                  Share.share({
                    title: article.title,
                    message: `${article.title}\n\n${article.paragraphs.join(
                      '\n\n',
                    )}`,
                  })
                }
                style={styles.BlogScreenSharePortico}
              >
                <LinearGradient
                  colors={[colors.shareGradStart, colors.shareGradEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.BlogScreenShareLintel}
                >
                  <Image
                    source={require('../assets/into-explorer-icon-share.png')}
                    style={styles.BlogScreenIconSigil}
                    resizeMode="contain"
                  />
                  <Text style={styles.BlogScreenShareFiligree}>Share</Text>
                </LinearGradient>
              </AnimatedPressable>
            </FadeSlideIn>
          </ScrollView>

          <TabBar activeIndex={activeTab} onTabPress={onTabPress} />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.BlogScreenFacetChassis}>
      <ImageBackground
        source={require('../assets/into-explorer-background.png')}
        style={styles.BlogScreenBackground}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.BlogScreenScrollLintel,
            { paddingBottom: TAB_BAR_TOTAL_HEIGHT + insets.bottom + spacing.l },
          ]}
        >
          <View style={styles.BlogScreenHeaderChassis}>
            <LinearGradient
              colors={[colors.topGradientStart, colors.topGradientEnd]}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[styles.BlogScreenHeaderInset, { paddingTop: insets.top }]}
            >
              <Text style={styles.BlogScreenTitleFiligree}>Winter Blog</Text>
            </View>
          </View>

          <View style={styles.BlogScreenListChassis}>
            {ARTICLES.map((item, index) => (
              <FadeSlideIn
                key={item.id}
                style={styles.BlogScreenCardChassis}
                delay={Math.min(index, 6) * 60}
              >
                <Text style={styles.BlogScreenCardTitleFiligree}>
                  {item.title}
                </Text>
                <Text
                  style={styles.BlogScreenCardPreviewFiligree}
                  numberOfLines={4}
                >
                  {item.paragraphs[0]}
                </Text>
                <AnimatedPressable
                  onPress={() => setSelectedId(item.id)}
                  style={styles.BlogScreenReadPortico}
                >
                  <Text style={styles.BlogScreenReadFiligree}>Read more</Text>
                  <Image
                    source={require('../assets/into-explorer-icon-arrow.png')}
                    style={styles.BlogScreenArrowSigil}
                    resizeMode="contain"
                  />
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
  BlogScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },

  BlogScreenBackground: {
    flex: 1,
  },
  BlogScreenArticleHeaderChassis: {
    overflow: 'hidden',
  },

  BlogScreenArticleHeaderInset: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  BlogScreenArticleHeaderLeftLintel: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  BlogScreenBackPortico: {
    marginRight: 8,
  },
  BlogScreenBackArrowSigil: {
    height: 24,
    width: 24,
  },
  BlogScreenBackFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 24,
  },

  BlogScreenScrollLintel: {
    flexGrow: 1,
  },

  BlogScreenHeaderChassis: {
    overflow: 'hidden',
  },
  BlogScreenHeaderInset: {
    paddingHorizontal: 16,
  },

  BlogScreenTitleFiligree: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 32,
    marginBottom: 16,
    marginTop: 8,
  },
  BlogScreenListChassis: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  BlogScreenCardChassis: {
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
  BlogScreenCardTitleFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
    width: 310,
  },
  BlogScreenCardPreviewFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 10,
  },
  BlogScreenReadPortico: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  BlogScreenReadFiligree: {
    color: colors.openMore,
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },

  BlogScreenIconSigil: {
    height: 22,
    width: 22,
  },
  BlogScreenArrowSigil: {
    height: 16,
    tintColor: colors.openMore,
    width: 16,
  },
  BlogScreenArticleChassis: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginHorizontal: 16,
    overflow: 'hidden',
    paddingBottom: 15,
    paddingHorizontal: 15,
    paddingTop: 16,
  },
  BlogScreenArticleTitleFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    width: 310,
  },

  BlogScreenArticleParaFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  BlogScreenSharePortico: {
    borderRadius: radius.button,
    height: 47,
    marginTop: 4,
    overflow: 'hidden',
    width: 108,
  },
  BlogScreenShareLintel: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },

  BlogScreenShareEmojiSigil: {
    fontSize: 18,
  },
  BlogScreenShareFiligree: {
    color: colors.placeTitle,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
  },
});
