package com.gotacar.backend.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintAppeal {

    @Id
    String id;

    @NotNull
    public Complaint complaint;

    @Length(max = 5000)
    @NotBlank
    public String content;

    @NotNull
    public Boolean checked;

    public ComplaintAppeal() {
    }

    public ComplaintAppeal(String c, Boolean check, Complaint comp) {
        this.complaint = comp;
        this.content = c;
        this.checked = check;
    }

    @Override
    public String toString() {
        return String.format("ComplaintAppeal[id=%s, content=%s, checked=%s, complaint=%s]", id, content, checked.toString(), complaint.toString());

    }
}
