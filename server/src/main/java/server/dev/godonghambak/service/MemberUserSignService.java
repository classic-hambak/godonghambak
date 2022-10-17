package server.dev.godonghambak.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import server.dev.godonghambak.domain.entity.MemberUser;
import server.dev.godonghambak.dao.MemberUserDao;

import java.util.UUID;

import static server.dev.godonghambak.domain.dto.MemberUserDto.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberUserSignService {

    private final MemberUserDao memberUserRepository;

    private final PasswordEncoder passwordEncoder;

    public MemberUser signUp(SignUp signUpinfo){

        //회원가입 하고자 하는 아이디 확인 중복확인

        //패스워드 인코딩
        String encodePassword = passwordEncoder.encode(signUpinfo.getMember_user_password());

        MemberUser newMember = MemberUser
                                .builder()
                                .member_user_id(UUID.randomUUID().toString().replace("-", ""))
                                .member_user_email(signUpinfo.getMember_user_email())
                                .member_user_password(encodePassword)
                                .member_user_name(signUpinfo.getMember_user_name())
                                .member_user_phone(signUpinfo.getMember_user_phone())
                                .member_user_birth(signUpinfo.getMember_user_birth())
                                .build();

        int result = memberUserRepository.insert(newMember);
        if(result > 0) {
            return newMember;
        }

        return null;
    }

    public MemberUser signIn(SignIn signInInfo) {

        MemberUser result = memberUserRepository.findByEmailAndPassword(signInInfo);

        //패스워드 확인
//        boolean passwordResult = passwordEncoder.matches(signInInfo.getMember_user_password(), result.getMember_user_password());
        boolean passwordResult = passwordEncoder.matches(result.getMember_user_password(), signInInfo.getMember_user_password());

        if(passwordResult && result != null) {
            return result;
        }
        return null;
    }

    public FindEmailResult findEmail(String name, String phone, String birth) {

        FindEmail findEmail = FindEmail.builder()
                                        .member_user_name(name)
                                        .member_user_phone(phone)
                                        .member_user_birth(birth)
                                        .build();

        FindEmailResult findEmailResult = memberUserRepository.findEmail(findEmail);
        return findEmailResult;
    }

    public boolean changePassword(ChangePassword changePassword) {
        int updateResult = memberUserRepository.updatePassword(changePassword);
        if(updateResult > 0) return true;
        return false;
    }
}
