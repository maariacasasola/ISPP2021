package com.gotacar.backend;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.gotacar.backend.models.User;
import com.gotacar.backend.models.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.assertj.core.api.Assertions.assertThat;


public class UserTest {

    @MockBean
    private UserRepository userRepo;

    private User usuario1;


    @BeforeEach
    void setup(){
        
        usuario1 = new User(); 
        usuario1.setId("2");
        usuario1.setFirstName("asdasd");
        usuario1.setLastName("pene");
    }

    @Test
    public void testSaveUser() throws Exception{

        userRepo.save(usuario1);

        verify(userRepo, times(1)).save(any());
    }
    
}
