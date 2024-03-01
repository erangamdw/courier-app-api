import otpGenerator from "otp-generator";

export const OtpCodeProvide = () => {
  try {
    const OTPCode = otpGenerator.generate(5, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    return OTPCode;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
