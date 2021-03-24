package com.gotacar.backend.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConplaintAppeal {

    @Id
    String id;

    // @NotNull
    // public Complaint complaint;

    @Length(max = 5000)
    @NotBlank
    public String content;

    @NotNull
    public Boolean checked;

    public ConplaintAppeal() {
    }

    public ConplaintAppeal(String c, Boolean check) {
        // this.complaint = comp;
        this.content = c;
        this.checked = check;
    }

    @Override
    public String toString() {
        return String.format("ComplaintAppeal[id=%s, content=%s, checked=%s]", id, content, checked.toString());

    }
}
