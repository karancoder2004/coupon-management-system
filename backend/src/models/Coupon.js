export class Coupon {
  constructor({
    code,
    description,
    discountType,
    discountValue,
    maxDiscountAmount = null,
    startDate,
    endDate,
    usageLimitPerUser = null,
    eligibility = {}
  }) {
    this.code = code;
    this.description = description;
    this.discountType = discountType;
    this.discountValue = discountValue;
    this.maxDiscountAmount = maxDiscountAmount;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.usageLimitPerUser = usageLimitPerUser;
    this.eligibility = eligibility;
    this.userUsage = {};
  }

  validate() {
    const errors = [];

    if (!this.code || typeof this.code !== 'string') {
      errors.push('Code is required and must be a string');
    }

    if (!this.description || typeof this.description !== 'string') {
      errors.push('Description is required and must be a string');
    }

    if (!['FLAT', 'PERCENT'].includes(this.discountType)) {
      errors.push('discountType must be either FLAT or PERCENT');
    }

    if (typeof this.discountValue !== 'number' || this.discountValue <= 0) {
      errors.push('discountValue must be a positive number');
    }

    if (this.discountType === 'PERCENT' && this.discountValue > 100) {
      errors.push('Percent discount cannot exceed 100%');
    }

    if (!(this.startDate instanceof Date) || isNaN(this.startDate)) {
      errors.push('startDate must be a valid date');
    }

    if (!(this.endDate instanceof Date) || isNaN(this.endDate)) {
      errors.push('endDate must be a valid date');
    }

    if (this.startDate >= this.endDate) {
      errors.push('endDate must be after startDate');
    }

    return errors;
  }

  isDateValid(currentDate = new Date()) {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }

  hasExceededUsageLimit(userId) {
    if (this.usageLimitPerUser === null) return false;
    const usage = this.userUsage[userId] || 0;
    return usage >= this.usageLimitPerUser;
  }

  incrementUsage(userId) {
    this.userUsage[userId] = (this.userUsage[userId] || 0) + 1;
  }

  calculateDiscount(cartValue) {
    let discount = 0;

    if (this.discountType === 'FLAT') {
      discount = this.discountValue;
    } else if (this.discountType === 'PERCENT') {
      discount = (this.discountValue / 100) * cartValue;
      if (this.maxDiscountAmount !== null) {
        discount = Math.min(discount, this.maxDiscountAmount);
      }
    }

    return Math.min(discount, cartValue);
  }

  toJSON() {
    return {
      code: this.code,
      description: this.description,
      discountType: this.discountType,
      discountValue: this.discountValue,
      maxDiscountAmount: this.maxDiscountAmount,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      usageLimitPerUser: this.usageLimitPerUser,
      eligibility: this.eligibility,
      userUsage: this.userUsage
    };
  }
}
