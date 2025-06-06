const WelcomeStep = ({ handleNext }: { handleNext: () => void; data: Partial<UserProfile>; updateData: (data: Partial<UserProfile>) => void }) => {
  return (
    <View style={styles.welcomeContainer}>
      {Platform.OS !== 'web' ? (
        <LottieView
          source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_vf8bnx.json' }}
          autoPlay
          loop
          style={styles.animation}
        />
      ) : (
        <Text style={styles.animationFallback}>Welcome Animation</Text>
      )}
      <Text style={styles.welcomeTitle}>Welcome to CoSpark</Text>
      <Text style={styles.welcomeSubtitle}>
        Find your perfect co-founder and build your dream startup.
      </Text>
      <Button
        title="Get Started"
        onPress={handleNext}
        variant="primary"
        style={styles.getStartedButton}
      />
    </View>
  );
};
