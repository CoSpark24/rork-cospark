import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";
import Theme from "@/constants/theme";
import Button from "./Button";
import Input from "./Input";
import { StartupStage, FundingStatus, UserRole, Industry, Availability } from "@/types";

export interface FilterOptions {
  location?: string;
  skills?: string[];
  stage?: StartupStage[];
  fundingStatus?: FundingStatus[];
  founderType?: string[];
  industry?: Industry[];
  availability?: Availability[];
  investmentRange?: string[];
  role?: UserRole[];
  [key: string]: string | string[] | undefined;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  initialFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  matchingRole?: UserRole;
}

const INVESTMENT_RANGES = [
  "$10K - $50K",
  "$50K - $100K", 
  "$100K - $500K",
  "$500K - $1M",
  "$1M - $5M",
  "$5M+"
];

const FOUNDER_TYPES = ["Technical", "Business", "Domain Expert"];

export default function FilterModal({
  visible,
  onClose,
  initialFilters,
  onApplyFilters,
  matchingRole,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const updateFilter = (key: keyof FilterOptions, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <T extends string>(
    key: keyof FilterOptions,
    value: T,
    currentArray: T[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const renderFilterSection = (title: string, children: React.ReactNode) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const renderToggleOptions = <T extends string>(
    options: T[],
    selectedOptions: T[] = [],
    onToggle: (option: T) => void
  ) => (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedOptions.includes(option) && styles.selectedOption,
          ]}
          onPress={() => onToggle(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOptions.includes(option) && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Filter Matches</Text>
          
          <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
            {/* Location Filter */}
            {renderFilterSection(
              "Location",
              <Input
                placeholder="Enter city name"
                value={filters.location || ""}
                onChangeText={(text) => updateFilter("location", text)}
              />
            )}

            {/* Role-specific filters */}
            {matchingRole === UserRole.INVESTOR && (
              <>
                {renderFilterSection(
                  "Investment Range",
                  renderToggleOptions(
                    INVESTMENT_RANGES,
                    filters.investmentRange || [],
                    (range) => toggleArrayFilter("investmentRange", range, filters.investmentRange)
                  )
                )}
              </>
            )}

            {(matchingRole === UserRole.CO_FOUNDER || matchingRole === UserRole.FOUNDER) && (
              <>
                {renderFilterSection(
                  "Startup Stage",
                  renderToggleOptions(
                    Object.values(StartupStage),
                    filters.stage || [],
                    (stage) => toggleArrayFilter("stage", stage, filters.stage)
                  )
                )}

                {renderFilterSection(
                  "Funding Status",
                  renderToggleOptions(
                    Object.values(FundingStatus),
                    filters.fundingStatus || [],
                    (status) => toggleArrayFilter("fundingStatus", status, filters.fundingStatus)
                  )
                )}

                {renderFilterSection(
                  "Founder Type",
                  renderToggleOptions(
                    FOUNDER_TYPES,
                    filters.founderType || [],
                    (type) => toggleArrayFilter("founderType", type, filters.founderType)
                  )
                )}
              </>
            )}

            {/* Industry Filter */}
            {renderFilterSection(
              "Industry",
              renderToggleOptions(
                Object.values(Industry),
                filters.industry || [],
                (industry) => toggleArrayFilter("industry", industry, filters.industry)
              )
            )}

            {/* Availability Filter */}
            {renderFilterSection(
              "Availability",
              renderToggleOptions(
                Object.values(Availability),
                filters.availability || [],
                (availability) => toggleArrayFilter("availability", availability, filters.availability)
              )
            )}

            {/* Role Filter (for multi-role matching) */}
            {renderFilterSection(
              "Looking For",
              renderToggleOptions(
                Object.values(UserRole),
                filters.role || [],
                (role) => toggleArrayFilter("role", role, filters.role)
              )
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title="Reset"
              onPress={() => setFilters({})}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title="Apply"
              onPress={handleApply}
              gradient
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Theme.borderRadius.xl,
    borderTopRightRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.xl,
    maxHeight: "85%",
  },
  title: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: Theme.typography.weights.bold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.lg,
    textAlign: "center",
  },
  filtersContainer: {
    marginBottom: Theme.spacing.xl,
  },
  filterSection: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: Theme.typography.weights.semibold as any,
    color: Colors.text,
    marginBottom: Theme.spacing.sm,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.spacing.sm,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
    fontSize: Theme.typography.sizes.sm,
  },
  selectedOptionText: {
    color: Colors.card,
    fontWeight: Theme.typography.weights.medium as any,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});